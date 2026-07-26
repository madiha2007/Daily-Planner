'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';
import { useOverlayStore } from '@/stores/useOverlayStore';

interface AnalyticsCardProps {
  title: string;
  value: string;
  trendData: { value: number }[];
  color?: string;
}

export default function AnalyticsCard({ title, value, trendData, color = '#10b981' }: AnalyticsCardProps) {
  const open = useOverlayStore((s) => s.open);

  return (
    <Card as="button" onClick={() => open('analyticsBreakdown')} className="text-left">
      <p className="text-xs text-neutral-400 mb-1">{title}</p>
      <p className="text-xl font-semibold text-neutral-900 mb-2">{value}</p>
      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
