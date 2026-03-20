import { IconDeviceGamepad2, IconMinus, IconSquare, IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { TitleBtn } from './components/TileBtn'

export default function TitleBar() {
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    window.appAPI.winIsMaximized().then(setMaximized)
  }, [])

  async function handleMaximize() {
    await window.appAPI.winMaximize()
    const m = await window.appAPI.winIsMaximized()
    setMaximized(m)
  }

  return (
    <div
      className="flex h-9 flex-shrink-0 select-none items-center border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-darkbg"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* App icon + title */}
      <div className="flex items-center gap-2 px-3">
        <IconDeviceGamepad2 size={15} className="text-primary" />
        <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
          IEC Game Testing
        </span>
      </div>

      {/* Drag spacer */}
      <div className="flex-1" />

      {/* Window controls — no-drag */}
      <div
        className="flex h-full items-center"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <TitleBtn
          title="Minimize"
          hoverClass="hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => window.appAPI.winMinimize()}
        >
          <IconMinus size={13} stroke={3} />
        </TitleBtn>
        <TitleBtn
          title={maximized ? 'Restore' : 'Maximize'}
          hoverClass="hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={handleMaximize}
        >
          <IconSquare size={12} stroke={3} />
        </TitleBtn>
        <TitleBtn
          title="Close"
          hoverClass="hover:bg-red-600 hover:text-white"
          onClick={() => window.appAPI.winClose()}
        >
          <IconX size={18} />
        </TitleBtn>
      </div>
    </div>
  )
}
