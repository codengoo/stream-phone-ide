import { ElectronAPI } from '@electron-toolkit/preload'

export interface SourceInfo {
  name: string
  contentType: string
  active: boolean
}

export interface ScreenInfo {
  Width: number
  Height: number
  Orientation: number
  Rotation: number
}

export interface StreamStatus {
  current: string
  sources: SourceInfo[]
  frameCount: number
  byteCount: number
  screenInfo: ScreenInfo | null
  time: string
}

export interface StreamAPI {
  // Window controls
  getHealth: () => Promise<boolean>
  getSources: () => Promise<{ sources: SourceInfo[] }>
  getStatus: () => Promise<StreamStatus>
  switchSource: (source: string) => Promise<boolean>

  // Device-scoped
  getDevices: () => Promise<string[]>
  getAdbDevices: () => Promise<string[]>
  getInfoFor: (serial: string, type?: string) => Promise<ScreenInfo>
  takeSnapshot: (serial: string, type?: string) => Promise<string | null>
  getStreamUrl: (serial: string, type?: string) => Promise<string>
  sendKeyEvent: (serial: string, keycode: number) => Promise<boolean>
  setRotation: (serial: string, rotation: number) => Promise<boolean>
  setServerConfig: (host: string, port: string) => Promise<boolean>
  getRandomPort: () => Promise<number>
}

export interface AppAPI {
  winMinimize: () => Promise<void>
  winMaximize: () => Promise<void>
  winClose: () => Promise<void>
  winIsMaximized: () => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    streamAPI: StreamAPI
    appAPI: AppAPI
  }
}
