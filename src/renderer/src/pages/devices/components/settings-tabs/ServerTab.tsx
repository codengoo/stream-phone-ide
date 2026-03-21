import { Divider, Tab, Tabs } from '@heroui/react'
import useServerSetting from '@hooks/useServerSetting'
import { CaptureSetting } from './components/CaptureSetting'
import { ServerLan } from './components/ServerLan'
import { ServerLocal } from './components/ServerLocal'
import { ServerRemote } from './components/ServerRemote'

export function ServerTab() {
  const { state: serverState, setServerSource } = useServerSetting()
  const serverSource = serverState.serverSource

  return (
    <div className="space-y-5 py-2">
      <CaptureSetting />
      <Divider />
      <Tabs
        size="sm"
        color="primary"
        selectedKey={serverSource}
        onSelectionChange={(value) => setServerSource(value as any)}
        classNames={{panel: "py-1"}}
      >
        <Tab key="local" title="Local">
          <ServerLocal />
        </Tab>

        <Tab key="remote" title="Remote">
          <ServerRemote />
        </Tab>

        <Tab key="lan" title="LAN">
          <ServerLan />
        </Tab>
      </Tabs>
    </div>
  )
}
