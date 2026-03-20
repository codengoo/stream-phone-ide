import { Button } from '@heroui/react'
import { useTheme } from '../hooks/useAppTheme'
import Modal from './ui/Modal'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {
  const { theme, setTheme } = useTheme()
  return (
    <Modal open={open} onClose={onClose} title="Cấu hình ứng dụng">
      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm text-slate-400">Theme</label>
          <div className="flex gap-2">
            {(['system', 'dark', 'light'] as const).map((t) => (
              <Button
                key={t}
                size="sm"
                variant={t === theme ? 'solid' : 'bordered'}
                color={t === theme ? 'primary' : 'default'}
                onPress={() => setTheme(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">Other settings</label>
          <div className="text-slate-500">Put your app-wide settings here.</div>
        </div>
      </div>
    </Modal>
  )
}

