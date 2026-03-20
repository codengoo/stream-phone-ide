import { Popover, PopoverTrigger, PopoverContent, type PopoverProps } from '@heroui/react'
import { IconInfoCircle } from '@tabler/icons-react'
import type { DeviceInfo } from '@services/api'

const ORIENTATION_LABELS = ['Portrait', 'Landscape-L', 'Portrait rev.', 'Landscape-R']

interface Props {
  serial: string
  info?: DeviceInfo
  placement?: PopoverProps['placement']
  triggerClassName?: string
  iconSize?: number
}

export default function DeviceInfoPopover({
  serial,
  info,
  placement = 'right',
  triggerClassName,
  iconSize = 12
}: Props) {
  return (
    <Popover placement={placement}>
      <PopoverTrigger>
        <button
          title="Device details"
          onClick={(e) => e.stopPropagation()}
          className={
            triggerClassName ??
            'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
          }
        >
          <IconInfoCircle size={iconSize} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="min-w-[160px] p-2 text-xs">
          <div className="mb-2 font-medium text-default-800">{serial}</div>
          {info ? (
            <table className="w-full text-left">
              <tbody className="text-default-500">
                <tr>
                  <td className="py-0.5 pr-4">Resolution</td>
                  <td className="py-0.5 text-default-700">
                    {info.Width} × {info.Height}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5 pr-4">Orientation</td>
                  <td className="py-0.5 text-default-700">
                    {ORIENTATION_LABELS[info.Orientation] ?? info.Orientation}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5 pr-4">Density</td>
                  <td className="py-0.5 text-default-700">{info.Density?.Current ?? '—'} dpi</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <span className="text-default-400">Loading…</span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
