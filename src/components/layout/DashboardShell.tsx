'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useIntersectionSection } from '@/hooks/useIntersectionSection';

const SECTION_IDS = [
  'overview',
  'tasks',
  'calendar',
  'habits',
  'heatmap',
  'analytics',
  'goals',
  'journal',
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  useIntersectionSection(SECTION_IDS);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 space-y-8 px-4 py-6 sm:px-8 sm:py-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
