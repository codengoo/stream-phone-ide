import { Slider } from '@heroui/react'
import useDisplaySetting from '@hooks/useDisplaySetting'

export function DisplayTab() {
  const { state, setCardSize } = useDisplaySetting()
  const cardSize = state.cardSize

  return (
    <div className="space-y-4 py-2">
      <Slider
        label="Card size"
        minValue={100}
        maxValue={280}
        step={10}
        value={cardSize}
        color="primary"
        onChange={(v) => setCardSize(typeof v === 'number' ? v : (v as number[])[0])}
      />
      <p className="text-xs text-default-400">Preview: {cardSize}px wide per card</p>
    </div>
  )
}
