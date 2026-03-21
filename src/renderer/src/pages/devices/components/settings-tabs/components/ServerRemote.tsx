import { Button, Input } from '@heroui/react'
import useServerSetting from '@renderer/hooks/useServerSetting'
import { useState } from 'react'

export function ServerRemote() {
  const { state: serverState, setServerConfig, setServerPass } = useServerSetting()
  const [remoteAddr, setRemoteAddr] = useState(serverState.serverHost)
  const [remotePort, setRemotePort] = useState(serverState.serverPort)
  const [remotePass, setRemotePass] = useState(serverState.serverPass)

  function applyRemote() {
    const host = remoteAddr.trim().replace(/^https?:\/\//, '')
    const port = remotePort.trim()
    setServerConfig(host, port)
    if (remotePass) setServerPass(remotePass)
  }

  return (
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
      <Button size="sm" color="primary" variant="flat" onPress={applyRemote} className="w-full">
        Connect
      </Button>
    </div>
  )
}
