import { Chip } from '@heroui/react'
import { BandwidthChart } from '@renderer/components/ui/BandwidthChart'
import { useServerStats } from '@renderer/hooks/useServerStats'
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react'

export function SystemStatus({ onStatusClick }: { onStatusClick: () => void }) {
  const { isOnline, bwHistory, currentBw } = useServerStats()
  return (
    <div className="flex flex-shrink-0 items-center gap-2 border-t border-slate-200 px-3 py-1.5 dark:border-slate-800">
      <Chip
        className='text-[10px] font-semibold cursor-pointer select-none'
        color={isOnline ? 'success' : 'danger'}
        variant="flat"
        startContent={isOnline ? <IconCircleCheck size={14} /> : <IconCircleX size={14} />}
        onClick={onStatusClick}
        title="Click to open settings"
        size="sm"
      >
        {isOnline ? 'Online' : 'Offline'}
      </Chip>

      <div className="ml-auto flex items-center gap-1.5">
        {bwHistory.length >= 2 && <BandwidthChart data={bwHistory} width={72} height={24} />}
        <span className="min-w-[52px] text-right text-[10px] tabular-nums text-slate-400">
          {currentBw} KB/s
        </span>
      </div>
    </div>
  )
}
