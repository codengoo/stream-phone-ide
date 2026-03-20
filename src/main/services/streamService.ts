/**
 * Main-process HTTP service for the streaming server.
 *
 * All endpoints follow the API spec at docs/api.md.
 * Use this module from IPC handlers instead of inline net.fetch calls.
 */

import { net } from 'electron'

let BASE_URL = 'http://localhost:9373'

export function setBaseUrl(host: string, port: string): void {
  BASE_URL = `http://${host}:${port}`
}

export function getBaseUrl(): string {
  return BASE_URL
}

// ── API Types ────────────────────────────────────────────────────────────────

export interface ResourceStatus {
  name: string
  /** 'ok' | 'missing' | `error: ${string}` */
  status: string
}

export interface HealthResponse {
  server: 'ok'
  resources: ResourceStatus[]
}

export interface DeviceEntry {
  Serial: string
  State: string
}

export interface DevicesResponse {
  devices: DeviceEntry[]
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

// ── Service ──────────────────────────────────────────────────────────────────

export const streamService = {
  /** GET /health */
  async getHealth(): Promise<HealthResponse> {
    const res = await net.fetch(`${BASE_URL}/health`)
    if (!res.ok) throw new Error(`health check failed: ${res.status}`)
    return res.json() as Promise<HealthResponse>
  },

  /** Returns true when the server is online and all resources report 'ok'. */
  async isHealthy(): Promise<boolean> {
    try {
      const h = await streamService.getHealth()
      return h.server === 'ok' && h.resources.every((r) => r.status === 'ok')
    } catch {
      return false
    }
  },

  /** GET /devices */
  async getDevices(): Promise<DeviceEntry[]> {
    const res = await net.fetch(`${BASE_URL}/devices`)
    if (!res.ok) throw new Error(`/devices failed: ${res.status}`)
    const body = (await res.json()) as DevicesResponse
    return body.devices
  },

  /** GET /:device/info */
  async getDeviceInfo(serial: string, type = 'minicap'): Promise<DeviceInfo> {
    const url = `${BASE_URL}/device/${encodeURIComponent(serial)}/info?type=${encodeURIComponent(type)}`
    const res = await net.fetch(url)
    if (!res.ok) throw new Error(`/info failed: ${res.status}`)
    return res.json() as Promise<DeviceInfo>
  },

  /** GET /:device/snapshot — returns raw bytes */
  async getSnapshot(serial: string, type = 'minicap'): Promise<ArrayBuffer> {
    const url = `${BASE_URL}/device/${encodeURIComponent(serial)}/snapshot?type=${encodeURIComponent(type)}`
    const res = await net.fetch(url)
    if (!res.ok) throw new Error(`/snapshot failed: ${res.status}`)
    return res.arrayBuffer()
  },

  /** Returns the direct stream URL for a device (no HTTP call). */
  streamUrl(serial: string, type = 'minicap'): string {
    return `${BASE_URL}/device/${encodeURIComponent(serial)}/stream?type=${encodeURIComponent(type)}`
  },

  /** Returns the direct snapshot URL for a device (no HTTP call). */
  snapshotUrl(serial: string, type = 'minicap'): string {
    return `${BASE_URL}/device/${encodeURIComponent(serial)}/snapshot?type=${encodeURIComponent(type)}`
  }
}
