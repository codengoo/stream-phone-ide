import { app, shell, BrowserWindow, ipcMain, dialog, net as electronNet } from 'electron'
import { join } from 'path'
import { createServer } from 'net'
import { writeFileSync } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { streamService, setBaseUrl, getBaseUrl } from './services/streamService'

const execAsync = promisify(exec)



function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ── IPC Handlers ─────────────────────────────────────────────────────────────

ipcMain.handle('stream:get-health', async () => {
  try {
    return await streamService.isHealthy()
  } catch {
    return false
  }
})

ipcMain.handle('stream:get-sources', async () => {
  // Try admin endpoint first, fall back to static list
  try {
    const res = await electronNet.fetch(`${getBaseUrl()}/admin/sources`)
    if (res.ok) return res.json()
  } catch {}
  return { sources: [ { name: 'minicap', contentType: 'image/jpeg', active: true }, { name: 'adbcap', contentType: 'video/h264', active: false } ] }
})

ipcMain.handle('stream:get-status', async () => {
  // server may not expose admin/status; try and fall back to health
  try {
    const res = await electronNet.fetch(`${getBaseUrl()}/admin/status`)
    if (res.ok) return res.json()
  } catch {}
  const health = await electronNet.fetch(`${getBaseUrl()}/health`).catch(() => null)
  if (!health) return null
  return { current: null, sources: [], frameCount: 0, byteCount: 0, screenInfo: null, time: new Date().toISOString() }
})

ipcMain.handle('stream:switch-source', async (_, source: string) => {
  // Switching source is handled client-side by selecting the proper stream URL
  // Keep this as a no-op for servers that support admin/source
  try {
    const res = await electronNet.fetch(`${getBaseUrl()}/admin/source`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source })
    })
    return res.ok
  } catch {
    return true
  }
})

ipcMain.handle('stream:get-info', async () => {
  // Legacy: no-arg getInfo is unsupported on multi-device API
  throw new Error('use getInfo(serial, type) instead')
})

ipcMain.handle('stream:take-snapshot', async (_event) => {
  throw new Error('use takeSnapshot(serial, type) instead')
})

ipcMain.handle('stream:get-adb-devices', async () => {
  try {
    const { stdout } = await execAsync('adb devices')
    const devices = stdout
      .split('\n')
      .slice(1)
      .filter((l) => l.includes('\tdevice'))
      .map((l) => l.split('\t')[0].trim())
    return devices
  } catch {
    return []
  }
})

// New device-scoped handlers per API spec
ipcMain.handle('stream:get-devices', async () => {
  try {
    const entries = await streamService.getDevices()
    return entries.map((d) => d.Serial)
  } catch {
    return []
  }
})

ipcMain.handle('stream:get-info-for', async (_, serial: string, type = 'minicap') => {
  return streamService.getDeviceInfo(serial, type)
})

ipcMain.handle('stream:take-snapshot-for', async (_event, serial: string, type = 'minicap') => {
  const win = BrowserWindow.getFocusedWindow()
  const result = await dialog.showSaveDialog(win!, {
    defaultPath: `snapshot-${serial}-${Date.now()}.jpg`,
    filters: [{ name: 'Image', extensions: ['jpg', 'jpeg', 'png'] }]
  })
  if (result.canceled || !result.filePath) return null

  const buf = await streamService.getSnapshot(serial, type)
  writeFileSync(result.filePath, Buffer.from(buf))
  return result.filePath
})

ipcMain.handle('stream:get-stream-url', async (_event, serial: string, type = 'minicap') => {
  return streamService.streamUrl(serial, type)
})

ipcMain.handle('stream:send-keyevent', async (_, { serial, keycode }: { serial: string; keycode: number }) => {
  const prefix = serial ? `adb -s ${serial}` : 'adb'
  try {
    await execAsync(`${prefix} shell input keyevent ${keycode}`)
    return true
  } catch {
    return false
  }
})

ipcMain.handle('win:minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
ipcMain.handle('win:maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) return
  win.isMaximized() ? win.unmaximize() : win.maximize()
})
ipcMain.handle('win:close', () => BrowserWindow.getFocusedWindow()?.close())
ipcMain.handle('win:is-maximized', () => BrowserWindow.getFocusedWindow()?.isMaximized() ?? false)

ipcMain.handle('stream:get-random-port', () => {
  return new Promise<number>((resolve, reject) => {
    const srv = createServer()
    srv.listen(0, '127.0.0.1', () => {
      const addr = srv.address()
      srv.close(() => {
        if (addr && typeof addr === 'object') resolve(addr.port)
        else reject(new Error('Could not get random port'))
      })
    })
  })
})

ipcMain.handle('stream:set-server-config', (_, { host, port }: { host: string; port: string }) => {
  setBaseUrl(host, port)
  return true
})

ipcMain.handle('stream:set-rotation', async (_, { serial, rotation }: { serial: string; rotation: number }) => {
  const prefix = serial ? `adb -s ${serial}` : 'adb'
  try {
    await execAsync(`${prefix} shell settings put system accelerometer_rotation 0`)
    await execAsync(`${prefix} shell settings put system user_rotation ${rotation}`)
    return true
  } catch {
    return false
  }
})

// ── App lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
