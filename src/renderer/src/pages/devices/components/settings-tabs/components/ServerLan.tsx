import { Button, Input } from '@heroui/react'
import Modal from '@renderer/components/ui/Modal'
import useServerSetting from '@renderer/hooks/useServerSetting'
import { IconCheck, IconLock, IconServer, IconWifi2, IconX } from '@tabler/icons-react'
import { useState } from 'react'

function SignalIcon({ strength }: { strength: LanEntry['signal'] }) {
  const color =
    strength === 'strong'
      ? 'text-green-500'
      : strength === 'medium'
        ? 'text-yellow-500'
        : 'text-red-400'
  return <IconWifi2 size={14} className={color} />
}

const MOCK_LAN: LanEntry[] = [
  {
    id: '1',
    name: 'StreamRelay-Office',
    address: '192.168.1.105',
    port: 9373,
    secured: false,
    signal: 'strong'
  },
  {
    id: '2',
    name: 'StreamRelay-Lab',
    address: '192.168.1.210',
    port: 9373,
    secured: true,
    signal: 'medium'
  },
  {
    id: '3',
    name: 'StreamRelay-Dev',
    address: '192.168.1.88',
    port: 9374,
    secured: true,
    signal: 'weak'
  }
]

interface LanEntry {
  id: string
  name: string
  address: string
  port: number
  secured: boolean
  signal: 'strong' | 'medium' | 'weak'
}

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

export function ServerLan() {
  const { setServerConfig } = useServerSetting()
  const [lanPassEntry, setLanPassEntry] = useState<LanEntry | null>(null)

  function handleLanSelect(entry: LanEntry) {
    if (entry.secured) setLanPassEntry(entry)
    else connectLan(entry, '')
  }

  function connectLan(entry: LanEntry, _password: string) {
    const host = entry.address
    const port = String(entry.port)
    setServerConfig(host, port)
  }

  return (
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
            <p className="truncate text-xs font-medium text-default-800">{entry.name}</p>
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

      <LanPasswordModal
        entry={lanPassEntry}
        onConfirm={connectLan}
        onClose={() => setLanPassEntry(null)}
      />
    </div>
  )
}
