'use client';

import { useAuthStore } from '@/stores/useAuthStore';

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
        <h1 className="font-script text-7xl text-peach-600">Hi, {useAuthStore((s) => s.user?.displayName)}</h1>
        <p className="text-sm text-cocoa-400">{getGreeting()} — here&apos;s your day</p>
      </div>

    </header>
  );
}

