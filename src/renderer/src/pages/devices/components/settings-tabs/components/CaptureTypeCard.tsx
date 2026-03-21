import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { CaptureType } from '@renderer/services/api'
import { IconInfoCircle } from '@tabler/icons-react'

export interface ICaptureOption {
  value: CaptureType
  label: string
  icon: React.ReactNode
  summary: string
  details: string
}

interface ICaptureTypeCardProps {
  option: ICaptureOption
  selected: boolean
  onSelect: () => void
}

export function CaptureTypeCard({ option, selected, onSelect }: ICaptureTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
        selected
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-500'
      }`}
    >
      <span
        className={`mt-0.5 flex-shrink-0 rounded-lg p-1.5 ${selected ? 'bg-primary/15 text-primary' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
      >
        {option.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-default-800'}`}>
          {option.label}
        </p>
        <p className="mt-0.5 text-xs text-default-500">{option.summary}</p>
      </div>
      <Popover placement="left" showArrow>
        <PopoverTrigger>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="More details"
          >
            <IconInfoCircle size={15} />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="max-w-[260px] p-3 text-xs leading-relaxed text-default-600">
            <p className="mb-1 font-semibold text-default-800">{option.label}</p>
            {option.details}
          </div>
        </PopoverContent>
      </Popover>
    </button>
  )
}
