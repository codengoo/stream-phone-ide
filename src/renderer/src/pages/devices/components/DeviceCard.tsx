import { useState, useEffect } from 'react'
import { IconRefresh } from '@tabler/icons-react'
import { api, snapshotUrl, type DeviceInfo, type CaptureType } from '@services/api'
import DeviceInfoPopover from '@ui/DeviceInfoPopover'

interface Props {
  serial: string
  selected: boolean
  info?: DeviceInfo
  captureType?: CaptureType
  onSelect: () => void
  onInfoLoaded: (info: DeviceInfo) => void
}

const SNAP_INTERVAL_MS = 5000

export default function DeviceCard({ serial, selected, info, captureType = 'minicap', onSelect, onInfoLoaded }: Props) {
  const [localInfo, setLocalInfo] = useState<DeviceInfo | undefined>(info)
  const [snapKey, setSnapKey] = useState(0)
  const [snapErr, setSnapErr] = useState(false)

  useEffect(() => {
    if (localInfo) return
    api
      .deviceInfo(serial, captureType)
      .then((i) => {
        setLocalInfo(i)
        onInfoLoaded(i)
      })
      .catch(() => {})
  }, [serial]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh thumbnail
  useEffect(() => {
    const id = setInterval(() => {
      setSnapKey((k) => k + 1)
      setSnapErr(false)
    }, SNAP_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const thumb = snapshotUrl(serial, captureType, snapKey)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={`group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all ${
        selected
          ? 'border-primary shadow-[0_0_0_3px_rgba(255,69,0,0.15)]'
          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-500'
      } bg-slate-50 dark:bg-[#161824]`}
    >
      {/* Phone screen area */}
      <div className="relative aspect-[9/16] overflow-hidden bg-[#0a0a0a]">
        {/* Notch */}
        <div className="absolute left-0 right-0 top-0 z-10 flex justify-center pt-1.5">
          <div className="h-1.5 w-10 rounded-full bg-black/60" />
        </div>

        {snapErr ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] text-slate-600">No preview</span>
          </div>
        ) : (
          <img
            key={snapKey}
            src={thumb}
            alt={`Screen of ${serial}`}
            className="h-full w-full object-contain"
            onError={() => setSnapErr(true)}
          />
        )}

        <button
          title="Refresh snapshot"
          onClick={(e) => {
            e.stopPropagation()
            setSnapKey((k) => k + 1)
            setSnapErr(false)
          }}
          className="absolute bottom-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          <IconRefresh size={12} />
        </button>
      </div>

      {/* Info strip — fills primary when selected */}
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 transition-colors ${
          selected
            ? 'bg-primary text-white'
            : 'bg-slate-50 text-slate-600 dark:bg-[#161824] dark:text-slate-300'
        }`}
      >
        <div
          className={`h-2 w-2 flex-shrink-0 rounded-full ${selected ? 'bg-white/80' : 'bg-green-400'}`}
          title="Online"
        />
        <span className="min-w-0 flex-1 truncate text-xs">{serial}</span>

        {/* Info popover */}
        <DeviceInfoPopover
          serial={serial}
          info={localInfo}
          placement="right"
          triggerClassName={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
            selected
              ? 'bg-white/20 text-white hover:bg-white/30'
              : 'bg-slate-200 text-slate-500 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
          }`}
        />
      </div>
    </div>
  )
}
