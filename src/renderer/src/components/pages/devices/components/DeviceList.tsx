import { useState } from 'react'
import { Button } from '@heroui/react'
import { IconRefresh, IconSettings2 } from '@tabler/icons-react'
import DeviceCard from './DeviceCard'
import SettingsModal from './SettingsModal'
import { useServerStats } from '@hooks/useServerStats'
import { BandwidthChart } from '@ui/BandwidthChart'
import type { DeviceInfo, CaptureType } from '@services/api'

interface Props {
  devices: string[]
  selectedDevice: string
  deviceInfos: Record<string, DeviceInfo>
  captureType: CaptureType
  onSelect: (serial: string) => void
  onRefresh: () => void
  onInfoLoaded: (serial: string, info: DeviceInfo) => void
  onCaptureTypeChange: (type: CaptureType) => void
}

const STORAGE_KEY = 'device-card-size'
const DEFAULT_SIZE = 140

function getSavedSize(): number {
  const v = localStorage.getItem(STORAGE_KEY)
  return v ? Number(v) : DEFAULT_SIZE
}

function formatTime(s: number): string {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function DeviceList({
  devices,
  selectedDevice,
  deviceInfos,
  captureType,
  onSelect,
  onRefresh,
  onInfoLoaded,
  onCaptureTypeChange
}: Props) {
  const [cardSize, setCardSize] = useState(getSavedSize)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { isOnline, bwHistory, currentBw, liveSeconds } = useServerStats()

  function handleSizeChange(size: number) {
    setCardSize(size)
    localStorage.setItem(STORAGE_KEY, String(size))
  }

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d0f1a]">
      {/* Header row 1 — title + actions */}
      <div className="flex flex-shrink-0 items-center gap-1 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <span className="flex-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Devices
        </span>
        <Button isIconOnly size="sm" variant="light" title="Refresh devices" onPress={onRefresh}>
          <IconRefresh size={14} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          title="Settings"
          onPress={() => setSettingsOpen(true)}
        >
          <IconSettings2 size={14} />
        </Button>
      </div>

      {/* Header row 2 — server stats */}
      <div className="flex flex-shrink-0 items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-3 py-1 dark:border-slate-800/50 dark:bg-[#0b0d18]/60">
        <span
          className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}
          title={isOnline ? 'Server online' : 'Server offline'}
        />
        <span className={`text-[10px] ${isOnline ? 'text-green-500 dark:text-green-400' : 'text-red-400'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        {isOnline && liveSeconds > 0 && (
          <span className="text-[10px] text-slate-400">⏱ {formatTime(liveSeconds)}</span>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          {bwHistory.length >= 2 && <BandwidthChart data={bwHistory} width={72} height={24} />}
          <span className="min-w-[52px] text-right text-[10px] tabular-nums text-slate-400">
            {currentBw} KB/s
          </span>
        </div>
      </div>

      {/* Device cards */}
      <div className="flex-1 overflow-y-auto p-3">
        {devices.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">No devices connected</div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {devices.map((serial) => (
              <div key={serial} style={{ width: cardSize }} className="flex-shrink-0">
                <DeviceCard
                  serial={serial}
                  selected={selectedDevice === serial}
                  info={deviceInfos[serial]}
                  captureType={captureType}
                  onSelect={() => onSelect(serial)}
                  onInfoLoaded={(info) => onInfoLoaded(serial, info)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        cardSize={cardSize}
        onCardSizeChange={handleSizeChange}
        captureType={captureType}
        onCaptureTypeChange={onCaptureTypeChange}
      />
    </div>
  )
}

