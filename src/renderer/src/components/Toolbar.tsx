import { useEffect, useRef } from 'react'
import { Button } from '@heroui/react'
import {
  IconRefresh,
  IconCamera,
  IconArrowLeft,
  IconHome,
  IconApps,
  IconRotate2,
  IconVolume2,
  IconVolume3,
  IconPower
} from '@tabler/icons-react'

// ADB key codes
const KEY = {
  BACK: 4,
  HOME: 3,
  APP_SWITCH: 187,
  VOLUME_UP: 24,
  VOLUME_DOWN: 25,
  POWER: 26
}

interface Props {
  devices: string[]
  selectedDevice: string
  onDeviceChange: (serial: string) => void
  sources: Array<{ name: string; active: boolean }>
  activeSource: string
  onSourceChange: (source: string) => void
  serverUrl: string
  serverHealth: boolean
  onRefreshDevices: () => void
  onSnapshot: () => void
  rotation: number
  onRotate: () => void
}

export function Toolbar({
  devices,
  selectedDevice,
  onDeviceChange,
  sources,
  activeSource,
  onSourceChange,
  serverHealth,
  onRefreshDevices,
  onSnapshot,
  rotation,
  onRotate
}: Props): React.JSX.Element {
  const deviceRef = useRef(selectedDevice)
  useEffect(() => { deviceRef.current = selectedDevice }, [selectedDevice])

  function sendKey(keycode: number): void {
    window.streamAPI.sendKeyEvent(deviceRef.current, keycode)
  }

  function ToolBtn({
    title,
    onClick,
    children
  }: {
    title: string
    onClick: () => void
    children: React.ReactNode
  }) {
    return (
      <Button
        isIconOnly
        size="sm"
        variant="flat"
        title={title}
        className="h-8 w-8 min-w-0 flex-shrink-0 border border-slate-600/50 bg-slate-700/50 text-slate-300 hover:bg-slate-600/60 hover:text-white"
        onClick={onClick}
      >
        {children}
      </Button>
    )
  }

  function Sep() {
    return <div className="h-5 w-px flex-shrink-0 bg-slate-600/60" />
  }

  return (
    <div className="flex h-11 flex-shrink-0 items-center gap-1.5 overflow-x-auto border-b border-slate-700/60 bg-[#1e2130] px-3">
      {/* Status dot */}
      <span
        title={serverHealth ? 'Server online' : 'Server offline'}
        className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
          serverHealth ? 'bg-green-400' : 'bg-red-400'
        }`}
      />

      {/* Device selector */}
      <span className="flex-shrink-0 text-xs text-slate-400">Device</span>
      <select
        value={selectedDevice}
        onChange={(e) => onDeviceChange(e.target.value)}
        className="flex-shrink-0 cursor-pointer rounded bg-slate-700/60 px-2 py-1 text-xs text-slate-200 outline-none"
      >
        {devices.length === 0 ? (
          <option value="">— no devices —</option>
        ) : (
          devices.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))
        )}
      </select>
      <ToolBtn title="Refresh devices" onClick={onRefreshDevices}>
        <IconRefresh size={14} />
      </ToolBtn>

      <Sep />

      {/* Source selector */}
      <span className="flex-shrink-0 text-xs text-slate-400">Source</span>
      <select
        value={activeSource}
        onChange={(e) => onSourceChange(e.target.value)}
        className="flex-shrink-0 cursor-pointer rounded bg-slate-700/60 px-2 py-1 text-xs text-slate-200 outline-none"
      >
        {sources.length === 0 ? (
          <>
            <option value="minicap">minicap</option>
            <option value="adbcap">adbcap</option>
          </>
        ) : (
          sources.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))
        )}
      </select>

      <Sep />

      <ToolBtn title="Take snapshot" onClick={onSnapshot}>
        <IconCamera size={14} />
      </ToolBtn>

      <Sep />

      <ToolBtn title="Back" onClick={() => sendKey(KEY.BACK)}>
        <IconArrowLeft size={14} />
      </ToolBtn>
      <ToolBtn title="Home" onClick={() => sendKey(KEY.HOME)}>
        <IconHome size={14} />
      </ToolBtn>
      <ToolBtn title="Recent apps" onClick={() => sendKey(KEY.APP_SWITCH)}>
        <IconApps size={14} />
      </ToolBtn>

      <Sep />

      <ToolBtn title={`Rotate (current: ${rotation * 90}°)`} onClick={onRotate}>
        <IconRotate2 size={14} />
      </ToolBtn>

      <Sep />

      <ToolBtn title="Volume down" onClick={() => sendKey(KEY.VOLUME_DOWN)}>
        <IconVolume2 size={14} />
      </ToolBtn>
      <ToolBtn title="Volume up" onClick={() => sendKey(KEY.VOLUME_UP)}>
        <IconVolume3 size={14} />
      </ToolBtn>

      <Sep />

      <ToolBtn title="Power" onClick={() => sendKey(KEY.POWER)}>
        <IconPower size={14} />
      </ToolBtn>
    </div>
  )
}

