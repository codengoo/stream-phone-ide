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
        labelPlacement="outside-top"
        // size="sm"
        placeholder="192.168.1.10"
        value={remoteAddr}
        onValueChange={setRemoteAddr}
      />

      <Input
        label="Password (optional)"
        labelPlacement="outside-top"
        // size="sm"
        type="password"
        value={remotePass}
        onValueChange={setRemotePass}
      />

      <div className="gap-2 grid grid-cols-3">
        <Button
          size="sm"
          color="primary"
          onPress={applyRemote}
          className="col-span-2"
        >
          Connect
        </Button>

        <Button
          size="sm"
          onPress={applyRemote}
          className="col-span-1"
        >
          Test connection...
        </Button>
      </div>
    </div>
  )
}
