import { Button } from '@heroui/react'
import type { CaptureType, DeviceInfo } from '@services/api'
import { IconRefresh, IconSettings2 } from '@tabler/icons-react'
import { useState } from 'react'
import DeviceCard from './DeviceCard'
import SettingsModal from './SettingsModal'
import { SystemStatus } from './SystemStatus'

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

export default function DeviceList(props: Props) {
  const {
    devices,
    selectedDevice,
    deviceInfos,
    captureType,
    onSelect,
    onRefresh,
    onInfoLoaded,
    onCaptureTypeChange
  } = props;

const STORAGE_KEY = 'device-card-size'
const DEFAULT_SIZE = 140

function getSavedSize(): number {
  const v = localStorage.getItem(STORAGE_KEY)
  return v ? Number(v) : DEFAULT_SIZE
}

// ...existing code...
  const [cardSize, setCardSize] = useState(getSavedSize)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'display' | 'server'>('display')


  function handleSizeChange(size: number) {
    setCardSize(size)
    localStorage.setItem(STORAGE_KEY, String(size))
  }

  // Handler to open settings modal with a specific tab
  function openSettings(tab: 'display' | 'server') {
    setSettingsTab(tab)
    setSettingsOpen(true)
  }

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-darkbg">
      {/* Header row 1 — title + actions */}
      <div className="flex flex-shrink-0 items-center gap-1 border-b border-slate-200 px-3 py-1 dark:border-slate-800">
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


      <SystemStatus onStatusClick={() => openSettings('server')} />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        cardSize={cardSize}
        onCardSizeChange={handleSizeChange}
        captureType={captureType}
        onCaptureTypeChange={onCaptureTypeChange}
        tab={settingsTab}
      />
    </div>
  )
}
