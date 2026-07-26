// components/ui/Modal.tsx
'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { ReactNode } from 'react';

export default function Modal({ children, title }: { children: ReactNode; title: string }) {
  const close = useOverlayStore((s) => s.close);

  return (
    <Dialog.Root open onOpenChange={(v) => !v && close()}>
      <Dialog.Portal forceMount>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2
                       rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Dialog.Title className="text-lg font-semibold mb-4">{title}</Dialog.Title>
            {children}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}