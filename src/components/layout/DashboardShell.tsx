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
  /** Rendered alongside the greeting, in the same header row (e.g. overview stat cards). */
  headerRight?: ReactNode;
}

export default function DashboardShell({ children, headerRight }: DashboardShellProps) {
  useIntersectionSection(SECTION_IDS);

  return (
    <div className="min-h-screen bg-neutral-100">
      <Sidebar />
      <div className="flex flex-col min-w-0 p-3 sm:p-5 md:pl-[6.5rem]">
        <div className="flex flex-1 flex-col rounded-3xl bg-neutral-50 border border-neutral-200 min-w-0">
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