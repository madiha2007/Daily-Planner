import { LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
  tone?: 'emerald' | 'blue' | 'purple' | 'amber';
  loading?: boolean;
  onClick?: () => void;
}

const toneClasses: Record<NonNullable<ProgressCardProps['tone']>, string> = {
  emerald: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
};

export default function ProgressCard({
  icon: Icon,
  label,
  value,
  subtext,
  tone = 'emerald',
  loading = false,
  onClick,
}: ProgressCardProps) {
  if (loading) {
    return (
      <Card className="flex items-center gap-4">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-5 w-12" />
        </div>
      </Card>
    );
  }

  return (
    <Card as={onClick ? 'button' : 'div'} onClick={onClick} className="flex items-center gap-4">
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', toneClasses[tone])}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-neutral-400">{label}</p>
        <p className="text-lg font-semibold text-neutral-900 truncate">{value}</p>
        {subtext && <p className="text-xs text-neutral-400 truncate">{subtext}</p>}
      </div>
    </Card>
  );
}
