'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { useOverlayStore } from '@/stores/useOverlayStore';

interface DrawerProps {
  title: string;
  children: ReactNode;
  widthClass?: string;
}

export default function Drawer({ title, children, widthClass = 'w-full sm:w-[440px]' }: DrawerProps) {
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
        <Dialog.Content asChild>
          <motion.div
            className={`fixed right-0 top-0 z-50 h-full ${widthClass} overflow-y-auto bg-white p-6 shadow-2xl focus:outline-none`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="mb-5 flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-neutral-900">{title}</Dialog.Title>
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
