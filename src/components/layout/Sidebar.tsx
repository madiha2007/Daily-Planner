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
  { id: 'tasks', label: 'Tasks', icon: PlusCircle },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
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
      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-full bg-cocoa-700 px-3 py-1.5
                 text-xs font-medium text-white opacity-0 shadow-warm
                 transition-all duration-150 -translate-x-1
                 group-hover:opacity-100 group-hover:translate-x-0"
    >
      {label}
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-cocoa-700" />
    </span>
  );
}

export default function Sidebar() {
  const activeSection = useUIStore((s) => s.activeSection);
  const scrollTo = useScrollToSection();
  const open = useOverlayStore((s) => s.open);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-20 shrink-0 flex flex-col items-center justify-between py-6 bg-peach-100">
      <div className="flex flex-col items-center gap-1">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft text-peach-500">
          <span className="font-script text-2xl">M</span>
        </div>

        <nav
          className="flex flex-col items-center gap-1 rounded-full border border-white/60 bg-white/70 backdrop-blur-sm px-2 py-3 shadow-soft"
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
                    ? 'bg-gradient-to-br from-peach-400 to-blush-400 text-white shadow-warm'
                    : 'text-cocoa-400 hover:bg-peach-50 hover:text-cocoa-600'
                )}
              >
                <Icon size={18} />
              </button>
              <SidebarTooltip label={label} />
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm p-2 shadow-soft">
        <div className="group relative">
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cocoa-400 hover:bg-red-50 hover:text-red-400 transition-colors"
          >
            <LogOut size={17} />
          </button>
          <SidebarTooltip label="Log out" />
        </div>

        <div className="group relative">
          <button
            onClick={() => open('profileSettings')}
            aria-label="Profile & settings"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cocoa-500 hover:bg-peach-50"
          >
            <User size={17} />
          </button>
          <SidebarTooltip label="Profile & settings" />
        </div>
      </div>
    </aside>
  );
}
