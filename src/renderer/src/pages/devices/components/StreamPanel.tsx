import { StreamDisplay } from '@components/StreamDisplay'
import type { DeviceInfo } from '@services/api'
import {
  IconApps,
  IconArrowLeft,
  IconCamera,
  IconHome,
  IconPower,
  IconVolume2,
  IconVolume3
} from '@tabler/icons-react'
import DeviceInfoPopover from '@ui/DeviceInfoPopover'
import { useEffect, useRef } from 'react'

interface Props {
  device: string
  streamUrl: string
  streamKey: number
  deviceInfo?: DeviceInfo
}

const KEY = {
  BACK: 4,
  HOME: 3,
  APP_SWITCH: 187,
  VOLUME_UP: 24,
  VOLUME_DOWN: 25,
  POWER: 26
}

const RIGHT_BAR_W = 44
const BOTTOM_BAR_H = 48

function StreamBtn({
  title,
  onClick,
  children
}: {
  title: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700/60 text-slate-300 transition-colors hover:bg-slate-600/80 hover:text-white"
    >
      {children}
    </button>
  )
}

export default function StreamPanel({ device, streamUrl, streamKey, deviceInfo }: Props) {
  const deviceRef = useRef(device)
  useEffect(() => {
    deviceRef.current = device
  }, [device])

  function sendKey(keycode: number): void {
    window.streamAPI.sendKeyEvent(deviceRef.current, keycode)
  }

  function handleCapture(): void {
    window.streamAPI.takeSnapshot(deviceRef.current)
  }

  if (!device) {
    return (
      <div className="flex flex-1 items-center justify-center w-full h-full">
        <p className="text-sm text-slate-400">Select a device to start streaming</p>
      </div>
    )
  }

  const rightBar = (
    <div className="flex h-full flex-col items-center justify-center gap-2 pl-1.5">
      <StreamBtn title="Screenshot" onClick={handleCapture}>
        <IconCamera size={16} />
      </StreamBtn>
      <StreamBtn title="Volume up" onClick={() => sendKey(KEY.VOLUME_UP)}>
        <IconVolume2 size={16} />
      </StreamBtn>
      <StreamBtn title="Volume down" onClick={() => sendKey(KEY.VOLUME_DOWN)}>
        <IconVolume3 size={16} />
      </StreamBtn>
      <StreamBtn title="Power" onClick={() => sendKey(KEY.POWER)}>
        <IconPower size={16} />
      </StreamBtn>
    </div>
  )

  const bottomBar = (
    <div className="flex items-center justify-center gap-6 pt-2">
      <StreamBtn title="Back" onClick={() => sendKey(KEY.BACK)}>
        <IconArrowLeft size={16} />
      </StreamBtn>
      <StreamBtn title="Home" onClick={() => sendKey(KEY.HOME)}>
        <IconHome size={16} />
      </StreamBtn>
      <StreamBtn title="Recent apps" onClick={() => sendKey(KEY.APP_SWITCH)}>
        <IconApps size={16} />
      </StreamBtn>
    </div>
  )

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-[#0b0d15]">
      {/* Header bar */}
      <div className="flex flex-shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-1.5 dark:border-slate-800">
        <span className="h-2 w-2 rounded-full bg-green-400" title="Online" />
        <span className="flex-1 truncate text-xs text-slate-500 dark:text-slate-400">{device}</span>
        {deviceInfo && (
          <span className="text-[10px] text-slate-400">
            {deviceInfo.Width}×{deviceInfo.Height}
          </span>
        )}
        <DeviceInfoPopover serial={device} info={deviceInfo} placement="bottom-end" />
      </div>
      {/* Stream fills remaining height */}
      <div className="flex flex-1 overflow-hidden">
        <StreamDisplay
          streamUrl={streamUrl}
          streamKey={streamKey}
          screenWidth={deviceInfo?.Width ?? 0}
          screenHeight={deviceInfo?.Height ?? 0}
          bottomBar={bottomBar}
          rightBar={rightBar}
          bottomBarHeight={BOTTOM_BAR_H}
          rightBarWidth={RIGHT_BAR_W}
        />
      </div>
    </div>
  )
}

