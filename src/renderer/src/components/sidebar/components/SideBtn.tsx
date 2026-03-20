import { Button, ButtonProps, Tooltip } from '@heroui/react'
import React from 'react'

interface SideBtnProps extends ButtonProps {
  icon: React.ReactNode
  title: string
  isActive?: boolean
  onPress?: () => void
}

export const SideBtn = React.forwardRef<HTMLButtonElement, SideBtnProps>(
  ({ icon, title, isActive, onPress, ...props }, ref) => {
    return (
      <Tooltip content={title} placement="right" showArrow color="primary">
        <Button
          isIconOnly
          variant={isActive ? 'flat' : 'light'}
          {...props}
          className={`h-10 w-10 ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          onPress={onPress}
          ref={ref}
        >
          {icon}
        </Button>
      </Tooltip>
    )
  }
)
SideBtn.displayName = 'SideBtn'
