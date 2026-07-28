'use client';

import { useRouter } from 'next/navigation';
import {
  Home,
  Calendar,
  PlusCircle,
  Repeat,
  BarChart3,
  Target,
  BookOpen,
  Flame,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/useUIStore';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { useOverlayStore } from '@/stores/useOverlayStore';

const sections = [
  { id: 'overview', label: 'Home', icon: Home },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: PlusCircle },
  { id: 'habits', label: 'Habits', icon: Repeat },
  { id: 'heatmap', label: 'Activity', icon: Flame },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'journal', label: 'Journal', icon: BookOpen },
];

function SidebarTooltip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-lg bg-blue-600 px-2.5 py-1.5
                 text-xs font-medium text-white opacity-0 shadow-lg
                 transition-all duration-150 -translate-x-1
                 group-hover:opacity-100 group-hover:translate-x-0"
    >
      {label}
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
    </span>
  );
}

export default function Sidebar() {
  const activeSection = useUIStore((s) => s.activeSection);
  const scrollTo = useScrollToSection();
  const open = useOverlayStore((s) => s.open);
  const router = useRouter();

  const handleLogout = () => {
    // Phase 2: clear real auth/session state here before redirecting.
    router.push('/login');
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-20 shrink-0 flex-col items-center justify-between py-6 bg-blue-100">
      <div className="flex flex-col items-center gap-1">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-black text-sm font-semibold">
          <h1 className='font-jacquarda text-5xl'>M</h1>
        </div>

        <nav
          className="flex flex-col items-center gap-1 rounded-full border border-white/40 bg-white/50 backdrop-blur-sm px-2 py-3 shadow-soft"
          aria-label="Dashboard sections"
        >
                   {sections.map(({ id, label, icon: Icon }) => (
            <div key={id} className="group relative">
              <button
                onClick={() => scrollTo(id)}
                aria-current={activeSection === id ? 'true' : undefined}
                aria-label={label}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                  activeSection === id
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-600'
                )}
              >
                <Icon size={18} />
              </button>
              <SidebarTooltip label={label} />
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-2 bg-white/50 p-2 rounded-full">
        <button
          onClick={handleLogout}
          title="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut size={17} />
        </button>

        <button
          onClick={() => open('profileSettings')}
          title="Profile & settings"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
        >
          <User size={17} />
        </button>
      </div>
    </aside>
  );
}