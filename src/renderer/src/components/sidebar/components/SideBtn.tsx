import { Button, Tooltip } from '@heroui/react'
import React from 'react'

interface SideBtnProps {
  icon: React.ReactNode
  title: string
  isActive?: boolean
  onPress?: () => void
}

export function SideBtn({ icon, title, isActive, onPress }: SideBtnProps) {
  return (
    <Tooltip content={title} placement="right">
      <Button
        isIconOnly
        variant={isActive ? 'flat' : 'light'}
        className={`h-10 w-10 ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title={title}
        onPress={onPress}
      >
        {icon}
      </Button>
    </Tooltip>
  )
}
