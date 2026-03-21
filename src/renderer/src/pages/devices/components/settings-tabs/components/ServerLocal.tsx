import { Button, Input } from '@heroui/react'
import Modal from '@renderer/components/ui/Modal'
import useServerSetting from '@renderer/hooks/useServerSetting'
import { IconCheck, IconDice, IconEdit, IconX } from '@tabler/icons-react'
import { useState } from 'react'

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

export function ServerLocal() {
  const { state: serverState, setServerConfig } = useServerSetting()
  const [changePortOpen, setChangePortOpen] = useState(false)

  const localHost = serverState.serverHost
  const localPort = serverState.serverPort

  async function handleRandomPort() {
    try {
      const port = await window.streamAPI.getRandomPort()
      const p = String(port)
      setServerConfig(localHost, p)
    } catch {}
  }

  return (
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
            isIconOnly
            size="sm"
            variant="flat"
            color="default"
            title="Change port"
            onPress={() => setChangePortOpen(true)}
          >
            <IconEdit size={15} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="default"
            title="Use a random available port"
            onPress={handleRandomPort}
          >
            <IconDice size={15} />
          </Button>
        </div>
      </div>
    </div>
  )
}
