'use client';

import { Search, Bell } from 'lucide-react';

// Placeholder profile name - replace with real user/auth data.
const USER_NAME = 'Madiha Patel';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-2 py-2">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-400">
          {getGreeting()}, {USER_NAME}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 rounded-full border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <button
          aria-label="Notifications"
          className="relative rounded-full border border-neutral-200 bg-white p-2.5 text-neutral-500 hover:bg-neutral-100"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </button>
      </div>
    </header>
  );
}
