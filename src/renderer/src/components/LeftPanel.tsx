interface Props {
  status: {
    current: string
    frameCount: number
    byteCount: number
    screenInfo: { Width: number; Height: number; Orientation: number; Rotation: number } | null
    time: string
  } | null
  serverHealth: boolean
  serverUrl: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

export function LeftPanel({ status, serverHealth, serverUrl }: Props): React.JSX.Element {
  return (
    <div className="flex w-56 flex-shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white text-xs text-slate-700 dark:border-slate-700/50 dark:bg-[#161824] dark:text-slate-300">
      <div className="border-b border-slate-200 px-3.5 py-3 dark:border-slate-700/50">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Server
        </div>
        <Row label="Status" value={serverHealth ? '🟢 Online' : '🔴 Offline'} />
        <Row label="URL" value={serverUrl} />
        {status && <Row label="Source" value={status.current || '—'} />}
        {status && <Row label="Updated" value={new Date(status.time).toLocaleTimeString()} />}
      </div>

      {status?.screenInfo && (
        <div className="border-b border-slate-200 px-3.5 py-3 dark:border-slate-700/50">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Screen
          </div>
          <Row
            label="Resolution"
            value={`${status.screenInfo.Width} × ${status.screenInfo.Height}`}
          />
          <Row label="Orientation" value={orientationLabel(status.screenInfo.Orientation)} />
          <Row label="Rotation" value={`${status.screenInfo.Rotation}°`} />
        </div>
      )}

      {status && (
        <div className="border-b border-slate-200 px-3.5 py-3 dark:border-slate-700/50">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Stats
          </div>
          <Row label="Frames" value={status.frameCount.toLocaleString()} />
          <Row label="Total data" value={formatBytes(status.byteCount)} />
        </div>
      )}

      <div className="flex flex-1 items-center justify-center p-5">
        <span className="text-center text-[11px] italic text-slate-400 dark:text-slate-600">More info coming soon…</span>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex justify-between gap-1.5 py-0.5">
      <span className="flex-shrink-0 text-slate-400 dark:text-slate-500">{label}</span>
      <span className="break-all text-right text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  )
}

function orientationLabel(o: number): string {
  return (
    ['Portrait', 'Landscape-left', 'Reverse portrait', 'Landscape-right'][o] ?? `${o}`
  )
}

