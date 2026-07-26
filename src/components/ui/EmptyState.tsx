import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="rounded-full bg-neutral-100 p-3">
        <Icon size={20} className="text-neutral-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-700">{title}</p>
        <p className="text-sm text-neutral-400">{message}</p>
      </div>
      {action}
    </div>
  );
}
