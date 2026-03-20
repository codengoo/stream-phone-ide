import { Slider } from '@heroui/react'
import Modal from '@ui/Modal'

interface Props {
  open: boolean
  onClose: () => void
  cardSize: number
  onCardSizeChange: (size: number) => void
}

export default function CardSizeModal({ open, onClose, cardSize, onCardSizeChange }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Card Settings">
      <div className="space-y-4 py-2">
        <Slider
          label="Card size"
          minValue={100}
          maxValue={280}
          step={10}
          value={cardSize}
          color="primary"
          onChange={(v) => onCardSizeChange(typeof v === 'number' ? v : (v as number[])[0])}
        />
        <p className="text-xs text-default-400">Preview: {cardSize}px wide per card</p>
      </div>
    </Modal>
  )
}
