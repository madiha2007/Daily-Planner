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

interface DashboardShellProps {
  children: ReactNode;
  headerRight?: ReactNode;
}

export default function DashboardShell({ children, headerRight }: DashboardShellProps) {
  useIntersectionSection(SECTION_IDS);

  return (
    <div className="min-h-screen bg-gradient-to-r from-peach-400 to-blush-400">
      <Sidebar />
      <div className="flex min-w-0 flex-col pl-4 pr-3 pb-3 pt-16 sm:pr-5 sm:pb-5 md:pl-[6.5rem] md:pt-5">
        <div className="flex flex-1 flex-col rounded-[2rem] bg-peach-100 bg-grid bg-grid border border-peach-200 min-w-0 shadow-soft">
          <div className="px-5 pt-4 sm:px-8 sm:pt-6 max-w-6xl w-full mx-auto">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <TopBar />
              {headerRight}
            </div>
          </div>
          <main className="flex-1 space-y-6 px-5 py-6 sm:px-8 sm:py-8 max-w-6xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}