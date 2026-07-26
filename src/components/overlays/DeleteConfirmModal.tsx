'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { Task } from '@/lib/types';

export default function DeleteConfirmModal() {
  const payload = useOverlayStore((s) => s.payload) as { task: Task } | null;
  const close = useOverlayStore((s) => s.close);
  const removeTask = useTaskStore((s) => s.removeTask);
  const [deleting, setDeleting] = useState(false);
  const task = payload?.task;

  if (!task) return null;

  const handleDelete = async () => {
    setDeleting(true);
    await removeTask(task.id);
    setDeleting(false);
    close();
  };

  return (
    <Modal title="Delete task" maxWidth="max-w-sm">
      <div className="flex flex-col items-center gap-3 text-center py-2">
        <div className="rounded-full bg-red-50 p-3">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <p className="text-sm text-neutral-600">
          Are you sure you want to delete <span className="font-medium text-neutral-900">&ldquo;{task.title}&rdquo;</span>?
          This cannot be undone.
        </p>
      </div>
      <div className="mt-5 flex justify-center gap-2">
        <Button variant="ghost" onClick={close}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}
