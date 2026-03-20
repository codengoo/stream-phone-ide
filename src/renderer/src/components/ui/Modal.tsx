import React from 'react'
import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@heroui/react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
}

export default function Modal({ open, onClose, title, children, size = '2xl' }: Props) {
  return (
    <HeroModal isOpen={open} onClose={onClose} backdrop="blur" size={size}>
      <ModalContent>
        {(closeModal) => (
          <>
            {title && (
              <ModalHeader className="text-default-900">{title}</ModalHeader>
            )}
            <ModalBody className="text-default-700">{children}</ModalBody>
            <ModalFooter>
              <Button variant="flat" color="default" onPress={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </HeroModal>
  )
}

