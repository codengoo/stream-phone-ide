/**
 * Renderer-side API service.
 *
 * All mutations/queries go through window.streamAPI (Electron IPC).
 * Image URLs (snapshot, stream) can be used directly in <img src> because
 * the CSP allows img-src http://localhost:9373.
 */

export const SERVER_URL = 'http://localhost:9373'

export function getServerUrl(): string {
  const host = localStorage.getItem('server-host') ?? 'localhost'
  const port = localStorage.getItem('server-port') ?? '9373'
  return `http://${host}:${port}`
}

export type CaptureType = 'minicap' | 'adbcap'

// ── Response types (from API docs) ───────────────────────────────────────────

export interface ResourceStatus {
  name: string
  /** 'ok' | 'missing' | `error: ${string}` */
  status: string
}

export interface DeviceEntry {
  Serial: string
  State: string
}

export interface Density {
  Physical: number
  Override: number
  Current: number
  Scale: number
}

export interface DeviceInfo {
  Width: number
  Height: number
  Orientation: number
  Rotation: number
  Density: Density
}

// ── URL helpers (no IPC needed, used directly in <img src>) ─────────────────

/** MJPEG stream URL — suitable for <img src="..."> */
export function streamUrl(serial: string, type: CaptureType = 'minicap'): string {
  return `${SERVER_URL}/${encodeURIComponent(serial)}/stream?type=${type}`
}

/** Snapshot URL — suitable for <img src="..."> */
export function snapshotUrl(
  serial: string,
  type: CaptureType = 'minicap',
  cacheBust?: number
): string {
  const base = `${getServerUrl()}/device/${encodeURIComponent(serial)}/snapshot?type=${type}`
  return cacheBust != null ? `${base}&t=${cacheBust}` : base
}

// ── IPC-backed API calls ─────────────────────────────────────────────────────

export const api = {
  /** Check server liveness */
  health: (): Promise<boolean> => window.streamAPI.getHealth(),

  /** List all connected device serials */
  devices: (): Promise<string[]> => window.streamAPI.getDevices(),

  /** Get screen dimensions, orientation and density for a device */
  deviceInfo: (serial: string, type: CaptureType = 'minicap'): Promise<DeviceInfo> =>
    window.streamAPI.getInfoFor(serial, type) as Promise<DeviceInfo>,

  /** Resolve the stream URL for a device via IPC */
  streamUrl: (serial: string, type: CaptureType = 'minicap'): Promise<string> =>
    window.streamAPI.getStreamUrl(serial, type),

  /** Save a snapshot to disk (returns local file path) */
  takeSnapshot: (serial: string, type: CaptureType = 'minicap'): Promise<string | null> =>
    window.streamAPI.takeSnapshot(serial, type),

  /** Switch capture source on the server */
  switchSource: (source: string): Promise<boolean> => window.streamAPI.switchSource(source),

  /** Send an ADB key event */
  sendKey: (serial: string, keycode: number): Promise<boolean> =>
    window.streamAPI.sendKeyEvent(serial, keycode),

  /** Set device rotation (0–3) */
  setRotation: (serial: string, rotation: number): Promise<boolean> =>
    window.streamAPI.setRotation(serial, rotation)
}
