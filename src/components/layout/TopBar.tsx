'use client';

import { Search, Bell } from 'lucide-react';

const USER_NAME = 'Madiha';

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
        <h1 className="font-script text-4xl text-peach-600">Hi, {USER_NAME}</h1>
        <p className="text-sm text-cocoa-400">{getGreeting()} — here&apos;s your day</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 rounded-full border border-peach-200 bg-white py-2 pl-9 pr-3 text-sm text-cocoa-700
                       placeholder:text-cocoa-300 focus:outline-none focus:ring-2 focus:ring-peach-300 focus:border-transparent"
          />
        </div>
        <button
          aria-label="Notifications"
          className="relative rounded-full border border-peach-200 bg-white p-2.5 text-cocoa-500 hover:bg-peach-50"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-peach-500" />
        </button>
      </div>
    </header>
  );
}

