import { useEffect, useState } from 'react'
import { IconDeviceMobile, IconMinus, IconSquare, IconSquareX } from '@tabler/icons-react'

export default function TitleBar() {
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    window.streamAPI.winIsMaximized().then(setMaximized)
  }, [])

  async function handleMaximize() {
    await window.streamAPI.winMaximize()
    const m = await window.streamAPI.winIsMaximized()
    setMaximized(m)
  }

  return (
    <div
      className="flex h-9 flex-shrink-0 select-none items-center border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d0f1a]"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* App icon + title */}
      <div className="flex items-center gap-2 px-3">
        <IconDeviceMobile size={15} className="text-primary" />
        <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
          Stream Viewer
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
          onClick={() => window.streamAPI.winMinimize()}
        >
          <IconMinus size={13} />
        </TitleBtn>
        <TitleBtn
          title={maximized ? 'Restore' : 'Maximize'}
          hoverClass="hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={handleMaximize}
        >
          <IconSquare size={12} />
        </TitleBtn>
        <TitleBtn
          title="Close"
          hoverClass="hover:bg-red-500 hover:text-white"
          onClick={() => window.streamAPI.winClose()}
        >
          <IconSquareX size={13} />
        </TitleBtn>
      </div>
    </div>
  )
}

function TitleBtn({
  title,
  onClick,
  hoverClass,
  children
}: {
  title: string
  onClick: () => void
  hoverClass: string
  children: React.ReactNode
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-9 w-11 items-center justify-center text-slate-500 transition-colors dark:text-slate-400 ${hoverClass}`}
    >
      {children}
    </button>
  )
}
