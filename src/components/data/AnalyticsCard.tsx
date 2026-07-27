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

export default function AnalyticsCard({ title, value, trendData, color = '#2563eb' }: AnalyticsCardProps) {
  const open = useOverlayStore((s) => s.open);

  return (
    <Card as="button" onClick={() => open('analyticsBreakdown')} className="text-center">
      <div className="h-16 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-neutral-500">{title}</p>
      <p className="text-sm font-semibold text-neutral-900">{value}</p>
    </Card>
  );
}
