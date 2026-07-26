'use client';

import { LayoutGrid, CheckSquare, Calendar, Repeat, Flame, BarChart3, Target, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/useUIStore';
import { useScrollToSection } from '@/hooks/useScrollToSection';

const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'habits', label: 'Habits', icon: Repeat },
  { id: 'heatmap', label: 'Heatmap', icon: Flame },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'journal', label: 'Journal', icon: BookOpen },
];

export default function Sidebar() {
  const activeSection = useUIStore((s) => s.activeSection);
  const scrollTo = useScrollToSection();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white px-3 py-6">
      <div className="mb-8 px-3">
        <span className="text-lg font-semibold text-neutral-900">Planner</span>
      </div>
      <nav className="flex flex-col gap-1" aria-label="Dashboard sections">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            aria-current={activeSection === id ? 'true' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors text-left',
              activeSection === id
                ? 'bg-emerald-50 font-medium text-emerald-700'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
