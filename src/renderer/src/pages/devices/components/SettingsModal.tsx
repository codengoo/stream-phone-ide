import { Tab, Tabs } from '@heroui/react'
import Modal from '@ui/Modal'
import { useEffect, useState } from 'react'
import { DisplayTab, ServerTab } from './settings-tabs'

interface Props {
  open: boolean
  onClose: () => void
  tab?: 'display' | 'server'
}

export default function SettingsModal({ open, onClose, tab = 'display' }: Props) {
  // Tab selection state only; tab content lives in separate components

  const [selectedTab, setSelectedTab] = useState(tab)
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
            <Tab key="display" title="Display">
              <DisplayTab />
            </Tab>

            <Tab key="server" title="Server">
              <ServerTab />
            </Tab>
          </Tabs>
        </div>
      </Modal>
    </>
  )
}
