import { BrowserWindow, ipcMain } from 'electron'

ipcMain.handle('win:minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
ipcMain.handle('win:maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) return
  win.isMaximized() ? win.unmaximize() : win.maximize()
})
ipcMain.handle('win:close', () => BrowserWindow.getFocusedWindow()?.close())
ipcMain.handle('win:is-maximized', () => BrowserWindow.getFocusedWindow()?.isMaximized() ?? false)
