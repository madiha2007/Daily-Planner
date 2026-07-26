'use client';

import { Search, Bell, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { useOverlayStore } from '@/stores/useOverlayStore';

export default function TopBar() {
  const open = useOverlayStore((s) => s.open);
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-neutral-200 bg-white/80 px-6 py-3 backdrop-blur-md">
      <div className="relative flex-1 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search tasks, habits, goals..."
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
        />
      </div>

      <span className="hidden sm:block text-sm text-neutral-500">{today}</span>

      <div className="ml-auto flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="relative rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </button>

        <button
          onClick={() => open('profileSettings')}
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-neutral-100"
        >
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-700">
            M
          </div>
          <ChevronDown size={14} className="text-neutral-400" />
        </button>
      </div>
    </header>
  );
}
