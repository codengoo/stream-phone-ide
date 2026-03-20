import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

const streamAPI = {
  getHealth: (): Promise<boolean> => ipcRenderer.invoke('stream:get-health'),

  getSources: (): Promise<{
    sources: Array<{ name: string; contentType: string; active: boolean }>
  }> => ipcRenderer.invoke('stream:get-sources'),

  getStatus: (): Promise<any> => ipcRenderer.invoke('stream:get-status'),

  // Device-aware APIs
  getDevices: (): Promise<string[]> => ipcRenderer.invoke('stream:get-devices'),

  getAdbDevices: (): Promise<string[]> => ipcRenderer.invoke('stream:get-adb-devices'),

  getInfoFor: (serial: string, type = 'minicap') =>
    ipcRenderer.invoke('stream:get-info-for', serial, type),

  takeSnapshot: (serial: string, type = 'minicap') =>
    ipcRenderer.invoke('stream:take-snapshot-for', serial, type),

  getStreamUrl: (serial: string, type = 'minicap') =>
    ipcRenderer.invoke('stream:get-stream-url', serial, type),

  sendKeyEvent: (serial: string, keycode: number): Promise<boolean> =>
    ipcRenderer.invoke('stream:send-keyevent', { serial, keycode }),

  setServerConfig: (host: string, port: string): Promise<boolean> =>
    ipcRenderer.invoke('stream:set-server-config', { host, port }),

  getRandomPort: (): Promise<number> => ipcRenderer.invoke('stream:get-random-port'),

  setRotation: (serial: string, rotation: number): Promise<boolean> =>
    ipcRenderer.invoke('stream:set-rotation', { serial, rotation }),

  switchSource: (source: string): Promise<boolean> =>
    ipcRenderer.invoke('stream:switch-source', source)
}

const appAPI = {
  winMinimize: (): Promise<void> => ipcRenderer.invoke('win:minimize'),
  winMaximize: (): Promise<void> => ipcRenderer.invoke('win:maximize'),
  winClose: (): Promise<void> => ipcRenderer.invoke('win:close'),
  winIsMaximized: (): Promise<boolean> => ipcRenderer.invoke('win:is-maximized')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('streamAPI', streamAPI)
    contextBridge.exposeInMainWorld('appAPI', appAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.streamAPI = streamAPI
  // @ts-ignore (define in dts)
  window.appAPI = appAPI
}
