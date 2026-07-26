'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { useOverlayStore } from '@/stores/useOverlayStore';

interface ModalProps {
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ title, description, children, maxWidth = 'max-w-lg' }: ModalProps) {
  const close = useOverlayStore((s) => s.close);

  return (
    <Dialog.Root open onOpenChange={(v) => !v && close()}>
      <Dialog.Portal forceMount>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild aria-describedby={description ? 'modal-description' : undefined}>
          <motion.div
            className={`fixed left-1/2 top-1/2 z-50 w-[92vw] ${maxWidth} -translate-x-1/2 -translate-y-1/2
                        rounded-2xl bg-white p-6 shadow-2xl focus:outline-none max-h-[85vh] overflow-y-auto`}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Dialog.Title className="text-lg font-semibold text-neutral-900">{title}</Dialog.Title>
                {description && (
                  <Dialog.Description id="modal-description" className="mt-1 text-sm text-neutral-500">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>
            {children}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
