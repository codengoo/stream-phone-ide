import React from 'react'
import { Button } from '@heroui/react'

interface Props {
  title?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  children?: React.ReactNode
}

export default function IconButton({ title, onClick, className, children }: Props) {
  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      title={title}
      className={`text-slate-400 hover:text-white ${className ?? ''}`}
      onPress={() => onClick?.({} as React.MouseEvent<HTMLButtonElement>)}
    >
      {children}
    </Button>
  )
}

