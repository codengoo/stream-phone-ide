import React from 'react'
import { Button, Popover, PopoverTrigger, PopoverContent } from '@heroui/react'
import {
  IconDeviceMobile,
  IconInfoCircle,
  IconSettings,
  IconSun,
  IconMoon,
  IconDeviceDesktop
} from '@tabler/icons-react'
import { useTheme } from '../hooks/useTheme'
import type { Theme } from '../store/slices/themeSlice'

interface Props {
  active: string
  onChange: (tab: string) => void
}

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <IconSun size={16} /> },
  { value: 'dark', label: 'Dark', icon: <IconMoon size={16} /> },
  { value: 'system', label: 'System', icon: <IconDeviceDesktop size={16} /> }
]

export function Sidebar({ active, onChange }: Props): React.JSX.Element {
  const { theme, setTheme } = useTheme()

  function SideBtn({
    tab,
    icon,
    title
  }: {
    tab: string
    icon: React.ReactNode
    title: string
  }) {
    const isActive = active === tab
    return (
      <Button
        isIconOnly
        variant={isActive ? 'flat' : 'light'}
        className={`h-10 w-10 ${
          isActive
            ? 'bg-[#ff4500]/10 text-[#ff4500]'
            : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title={title}
        onClick={() => onChange(tab)}
      >
        {icon}
      </Button>
    )
  }

  const currentThemeIcon =
    theme === 'light' ? <IconSun size={20} /> :
    theme === 'dark' ? <IconMoon size={20} /> :
    <IconDeviceDesktop size={20} />

  return (
    <div className="flex h-full w-14 flex-shrink-0 flex-col items-center gap-1 border-r border-slate-200 bg-slate-100 pb-2 pt-2 dark:border-slate-800 dark:bg-[#0b0d15]">
      <SideBtn tab="devices" icon={<IconDeviceMobile size={20} />} title="Devices" />
      <SideBtn tab="info" icon={<IconInfoCircle size={20} />} title="Info" />
      <div className="flex-1" />

      {/* Theme popover */}
      <Popover placement="right">
        <PopoverTrigger>
          <Button
            isIconOnly
            variant="light"
            className="h-10 w-10 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            title="Change theme"
          >
            {currentThemeIcon}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2">
          <div className="flex flex-col gap-0.5">
            <div className="mb-1 px-2 text-xs text-default-500">Theme</div>
            {THEME_OPTIONS.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  theme === value
                    ? 'bg-[#ff4500]/15 text-[#ff4500]'
                    : 'text-default-700 hover:bg-default-100'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <SideBtn tab="settings" icon={<IconSettings size={20} />} title="Settings" />
    </div>
  )
}

export default Sidebar

