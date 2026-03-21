import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  Tab,
  Tabs
} from '@heroui/react'
import type { CaptureType } from '@services/api'
import {
  IconBroadcast,
  IconCheck,
  IconDeviceUsb,
  IconDice,
  IconEdit,
  IconInfoCircle,
  IconLock,
  IconServer,
  IconWifi,
  IconWifi2,
  IconX
} from '@tabler/icons-react'
import Modal from '@ui/Modal'
import { useEffect, useState } from 'react'

// ── Storage keys ──────────────────────────────────────────────────────────────
const HOST_KEY = 'server-host'
const PORT_KEY = 'server-port'
const REMOTE_PASS_KEY = 'server-pass'
const SERVER_MODE_KEY = 'server-mode'

type ServerMode = 'local' | 'remote'

// ── Mock LAN data ─────────────────────────────────────────────────────────────
interface LanEntry {
  id: string
  name: string
  address: string
  port: number
  secured: boolean
  signal: 'strong' | 'medium' | 'weak'
}

const MOCK_LAN: LanEntry[] = [
  { id: '1', name: 'StreamRelay-Office', address: '192.168.1.105', port: 9373, secured: false, signal: 'strong' },
  { id: '2', name: 'StreamRelay-Lab',    address: '192.168.1.210', port: 9373, secured: true,  signal: 'medium' },
  { id: '3', name: 'StreamRelay-Dev',    address: '192.168.1.88',  port: 9374, secured: true,  signal: 'weak'   },
]

// ── Capture card data ─────────────────────────────────────────────────────────
const CAPTURE_OPTIONS: {
  value: CaptureType
  label: string
  icon: React.ReactNode
  summary: string
  details: string
}[] = [
  {
    value: 'minicap',
    label: 'minicap',
    icon: <IconBroadcast size={22} />,
    summary: 'Fast MJPEG via native library',
    details:
      'Requires the minicap binary deployed on the device. Delivers the highest frame rate with minimal CPU overhead. Not compatible with some heavily customised ROMs (MIUI, ColorOS). A running minicap service on the relay server is required.'
  },
  {
    value: 'adbcap',
    label: 'adbcap',
    icon: <IconDeviceUsb size={22} />,
    summary: 'Screen capture via ADB screencap',
    details:
      'Uses the standard adb screencap command — no extra binary required on the device. Works on nearly every ADB-enabled device. Lower frame rate (~5–10 fps) and higher CPU overhead than minicap. Suitable when binary deployment is not possible.'
  }
]

// ── CaptureTypeCard ───────────────────────────────────────────────────────────
function CaptureTypeCard({
  option,
  selected,
  onSelect
}: {
  option: (typeof CAPTURE_OPTIONS)[0]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
        selected
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-500'
      }`}
    >
      <span
        className={`mt-0.5 flex-shrink-0 rounded-lg p-1.5 ${
          selected
            ? 'bg-primary/15 text-primary'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
        }`}
      >
        {option.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-default-800'}`}>
          {option.label}
        </p>
        <p className="mt-0.5 text-xs text-default-500">{option.summary}</p>
      </div>
      <Popover placement="left" showArrow>
        <PopoverTrigger>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="More details"
          >
            <IconInfoCircle size={15} />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="max-w-[260px] p-3 text-xs leading-relaxed text-default-600">
            <p className="mb-1 font-semibold text-default-800">{option.label}</p>
            {option.details}
          </div>
        </PopoverContent>
      </Popover>
    </button>
  )
}

// ── LAN password modal ────────────────────────────────────────────────────────
function LanPasswordModal({
  entry,
  onConfirm,
  onClose
}: {
  entry: LanEntry | null
  onConfirm: (entry: LanEntry, password: string) => void
  onClose: () => void
}) {
  const [password, setPassword] = useState('')

  function handleConfirm() {
    if (!entry) return
    onConfirm(entry, password)
    setPassword('')
    onClose()
  }

  return (
    <Modal open={!!entry} onClose={onClose} title="Authentication required" size="xs">
      {entry && (
        <div className="space-y-4 py-1">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
            <IconServer size={18} className="flex-shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-default-800">{entry.name}</p>
              <p className="text-xs text-default-400">
                {entry.address}:{entry.port}
              </p>
            </div>
          </div>
          <Input
            label="Password"
            labelPlacement="outside"
            size="sm"
            type="password"
            variant="bordered"
            value={password}
            onValueChange={setPassword}
            classNames={{ inputWrapper: 'focus-within:border-primary' }}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="flat" color="default" onPress={onClose}>
              <IconX size={14} />
              Cancel
            </Button>
            <Button size="sm" variant="flat" color="primary" onPress={handleConfirm}>
              <IconCheck size={14} />
              Connect
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

// ── ChangePortModal ───────────────────────────────────────────────────────────
function ChangePortModal({
  open,
  currentPort,
  onConfirm,
  onClose
}: {
  open: boolean
  currentPort: string
  onConfirm: (port: string) => void
  onClose: () => void
}) {
  const [value, setValue] = useState(currentPort)

  function handleConfirm() {
    onConfirm(value.trim())
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Change port" size="xs">
      <div className="space-y-4 py-1">
        <Input
          label="New port"
          labelPlacement="outside"
          size="sm"
          variant="bordered"
          value={value}
          onValueChange={setValue}
          classNames={{ inputWrapper: 'focus-within:border-primary' }}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="flat" color="default" onPress={onClose}>
            <IconX size={14} />
            Cancel
          </Button>
          <Button size="sm" variant="flat" color="primary" onPress={handleConfirm}>
            <IconCheck size={14} />
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ── Signal strength icon ──────────────────────────────────────────────────────
function SignalIcon({ strength }: { strength: LanEntry['signal'] }) {
  const color =
    strength === 'strong' ? 'text-green-500' :
    strength === 'medium' ? 'text-yellow-500' :
    'text-red-400'
  return <IconWifi2 size={14} className={color} />
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
  cardSize: number
  onCardSizeChange: (size: number) => void
  captureType: CaptureType
  onCaptureTypeChange: (t: CaptureType) => void
  tab?: 'display' | 'server'
}

export default function SettingsModal({
  open,
  onClose,
  cardSize,
  onCardSizeChange,
  captureType,
  onCaptureTypeChange,
  tab = 'display',
}: Props) {
  const [serverMode, setServerMode] = useState<ServerMode>(
    () => (localStorage.getItem(SERVER_MODE_KEY) as ServerMode) ?? 'local'
  )

  const localHost = localStorage.getItem(HOST_KEY) ?? 'localhost'
  const [localPort, setLocalPort] = useState(() => localStorage.getItem(PORT_KEY) ?? '9373')
  const [changePortOpen, setChangePortOpen] = useState(false)

  const [remoteAddr, setRemoteAddr] = useState(
    () => localStorage.getItem(HOST_KEY) ?? 'localhost'
  )
  const [remotePort, setRemotePort] = useState(
    () => localStorage.getItem(PORT_KEY) ?? '9373'
  )
  const [remotePass, setRemotePass] = useState(
    () => localStorage.getItem(REMOTE_PASS_KEY) ?? ''
  )

  const [lanPassEntry, setLanPassEntry] = useState<LanEntry | null>(null)

  function applyRemote() {
    const host = remoteAddr.trim().replace(/^https?:\/\//, '')
    const port = remotePort.trim()
    localStorage.setItem(HOST_KEY, host)
    localStorage.setItem(PORT_KEY, port)
    if (remotePass) localStorage.setItem(REMOTE_PASS_KEY, remotePass)
    window.streamAPI.setServerConfig(host, port)
  }

  function handlePortConfirm(port: string) {
    setLocalPort(port)
    localStorage.setItem(PORT_KEY, port)
    window.streamAPI.setServerConfig(localHost, port)
  }

  async function handleRandomPort() {
    try {
      const port = await window.streamAPI.getRandomPort()
      const p = String(port)
      setLocalPort(p)
      localStorage.setItem(PORT_KEY, p)
      window.streamAPI.setServerConfig(localHost, p)
    } catch { /* ignore */ }
  }

  function switchMode(mode: ServerMode) {
    setServerMode(mode)
    localStorage.setItem(SERVER_MODE_KEY, mode)
  }

  function handleLanSelect(entry: LanEntry) {
    if (entry.secured) {
      setLanPassEntry(entry)
    } else {
      connectLan(entry, '')
    }
  }

  function connectLan(entry: LanEntry, _password: string) {
    const host = entry.address
    const port = String(entry.port)
    localStorage.setItem(HOST_KEY, host)
    localStorage.setItem(PORT_KEY, port)
    window.streamAPI.setServerConfig(host, port)
  }

  const [selectedTab, setSelectedTab] = useState(tab);
  // Sync tab prop to state when modal opens
  useEffect(() => {
    if (open) setSelectedTab(tab)
  }, [open, tab])

  return (
    <>
      <Modal open={open} onClose={onClose} title="Settings" size="md">
        {/* Fixed height — prevents tab switching from changing modal size */}
        <div className="h-[480px] overflow-y-auto">
          <Tabs
            aria-label="Settings"
            size="sm"
            variant="solid"
            color="primary"
            fullWidth
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab as any}
          >

            {/* ── Display tab ── */}
            <Tab key="display" title="Display">
              <div className="space-y-4 py-2">
                <Slider
                  label="Card size"
                  minValue={100}
                  maxValue={280}
                  step={10}
                  value={cardSize}
                  color="primary"
                  onChange={(v) =>
                    onCardSizeChange(typeof v === 'number' ? v : (v as number[])[0])
                  }
                />
                <p className="text-xs text-default-400">Preview: {cardSize}px wide per card</p>
              </div>
            </Tab>

            {/* ── Server tab ── */}
            <Tab key="server" title="Server">
              <div className="space-y-5 py-2">

                {/* Capture mode */}
                <div>
                  <p className="mb-2 text-xs font-medium text-default-600">Capture mode</p>
                  <div className="space-y-2">
                    {CAPTURE_OPTIONS.map((opt) => (
                      <CaptureTypeCard
                        key={opt.value}
                        option={opt}
                        selected={captureType === opt.value}
                        onSelect={() => onCaptureTypeChange(opt.value)}
                      />
                    ))}
                  </div>
                </div>

                <hr className="border-slate-200 dark:border-slate-800" />

                {/* Server URL — mode toggle */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <p className="flex-1 text-xs font-medium text-default-600">Server</p>
                    <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                      {(['local', 'remote'] as ServerMode[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => switchMode(m)}
                          className={`px-3 py-1 text-[11px] font-medium capitalize transition-colors ${
                            serverMode === m
                              ? 'bg-primary text-white'
                              : 'text-default-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {serverMode === 'local' ? (
                    <div className="space-y-2">
                      <Input
                        label="Current address"
                        labelPlacement="outside"
                        size="sm"
                        color="primary"
                        isReadOnly
                        value={`http://${localHost}:${localPort}`}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          label="Port"
                          labelPlacement="outside"
                          size="sm"
                          color="primary"
                          isDisabled
                          value={localPort}
                          className="flex-1"
                        />
                        <div className="mt-5 flex gap-1">
                          <Button
                            isIconOnly size="sm" variant="flat" color="default"
                            title="Change port"
                            onPress={() => setChangePortOpen(true)}
                          >
                            <IconEdit size={15} />
                          </Button>
                          <Button
                            isIconOnly size="sm" variant="flat" color="default"
                            title="Use a random available port"
                            onPress={handleRandomPort}
                          >
                            <IconDice size={15} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        label="Address"
                        labelPlacement="outside"
                        size="sm"
                        variant="bordered"
                        placeholder="192.168.1.10"
                        value={remoteAddr}
                        onValueChange={setRemoteAddr}
                        classNames={{ inputWrapper: 'focus-within:border-primary' }}
                      />
                      <div className="flex gap-2">
                        <Input
                          label="Port"
                          labelPlacement="outside"
                          size="sm"
                          variant="bordered"
                          value={remotePort}
                          onValueChange={setRemotePort}
                          classNames={{ inputWrapper: 'focus-within:border-primary' }}
                          className="w-28"
                        />
                        <Input
                          label="Password (optional)"
                          labelPlacement="outside"
                          size="sm"
                          variant="bordered"
                          type="password"
                          value={remotePass}
                          onValueChange={setRemotePass}
                          classNames={{ inputWrapper: 'focus-within:border-primary' }}
                          className="flex-1"
                        />
                      </div>
                      <Button
                        size="sm" color="primary" variant="flat"
                        onPress={applyRemote}
                        className="w-full"
                      >
                        Connect
                      </Button>
                    </div>
                  )}
                </div>

                <hr className="border-slate-200 dark:border-slate-800" />

                {/* LAN Discovery */}
                <div>
                  <div className="mb-2 flex items-center gap-1.5">
                    <IconWifi size={13} className="text-default-500" />
                    <p className="text-xs font-medium text-default-600">LAN Discovery</p>
                    <span className="ml-auto text-[10px] text-default-400">
                      {MOCK_LAN.length} found
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {MOCK_LAN.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => handleLanSelect(entry)}
                        className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-primary/60 hover:bg-primary/5 dark:border-slate-700 dark:bg-[#161824] dark:hover:border-primary/40 dark:hover:bg-primary/10"
                      >
                        <IconServer size={15} className="flex-shrink-0 text-default-400" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-default-800">
                            {entry.name}
                          </p>
                          <p className="text-[10px] text-default-400">
                            {entry.address}:{entry.port}
                          </p>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-1.5">
                          <SignalIcon strength={entry.signal} />
                          {entry.secured && (
                            <IconLock size={12} className="text-slate-400" title="Password required" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </Tab>

          </Tabs>
        </div>
      </Modal>

      <ChangePortModal
        open={changePortOpen}
        currentPort={localPort}
        onConfirm={handlePortConfirm}
        onClose={() => setChangePortOpen(false)}
      />

      <LanPasswordModal
        entry={lanPassEntry}
        onConfirm={connectLan}
        onClose={() => setLanPassEntry(null)}
      />
    </>
  )
}
