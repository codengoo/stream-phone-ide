import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { useTheme } from '@renderer/hooks/useAppTheme'
import { Theme } from '@store/slices/themeSlice'
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'
import { SideBtn } from './SideBtn'

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <IconSun size={16} /> },
  { value: 'dark', label: 'Dark', icon: <IconMoon size={16} /> },
  { value: 'system', label: 'System', icon: <IconDeviceDesktop size={16} /> }
]

export function ThemeBtn() {
  const { theme, setTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger>
        <SideBtn
          icon={
            theme === 'light' ? (
              <IconSun size={20} />
            ) : theme === 'dark' ? (
              <IconMoon size={20} />
            ) : (
              <IconDeviceDesktop size={20} />
            )
          }
          title="Change theme"
        />
      </PopoverTrigger>
      <PopoverContent className="p-2 min-w-44">
        <div className="flex flex-col gap-0.5 w-full">
          <div className="mb-1 px-2 text-xs text-default-500">Theme</div>
          {THEME_OPTIONS.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                theme === value
                  ? 'bg-primary/10 text-primary'
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
  )
}
