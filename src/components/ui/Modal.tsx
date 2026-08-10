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
            className="fixed inset-0 z-40 bg-cocoa-800/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        </Dialog.Overlay>

        {/* Fixed full-screen flex wrapper guarantees true viewport centering regardless of page scroll */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content asChild aria-describedby={description ? 'modal-description' : undefined}>
            <motion.div
              className={`w-full ${maxWidth} rounded-xl border border-peach-200 bg-cream-100 p-6 shadow-warm
                          focus:outline-none max-h-[85vh] overflow-y-auto`}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <Dialog.Title className="text-xl font-semibold text-cocoa-800">{title}</Dialog.Title>
                  {description && (
                    <Dialog.Description id="modal-description" className="mt-1 text-sm text-cocoa-400">
                      {description}
                    </Dialog.Description>
                  )}
                </div>
                <Dialog.Close asChild>
                  <button
                    aria-label="Close"
                    className="rounded-full p-1.5 text-cocoa-400 hover:bg-peach-100 hover:text-cocoa-600"
                  >
                    <X size={18} />
                  </button>
                </Dialog.Close>
              </div>
              {children}
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}