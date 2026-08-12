'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
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
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/useUIStore';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { logOut } from '@/lib/firebase/auth';
import { useAuthStore } from '@/stores/useAuthStore';

const DASHBOARD_PATH = '/dashboard';
const PENDING_SCROLL_KEY = 'pendingScrollSection';

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

function NavLinks({
  activeSection,
  onNavigate,
  showLabels = false,
}: {
  activeSection: string;
  onNavigate: (id: string) => void;
  showLabels?: boolean;
}) {
  if (showLabels) {
    return (
      <nav className="flex w-full flex-col gap-1 px-3" aria-label="Dashboard sections">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            aria-current={activeSection === id ? 'true' : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              activeSection === id
                ? 'bg-gradient-to-br from-peach-400 to-blush-400 text-white shadow-warm'
                : 'text-cocoa-500 hover:bg-peach-50 hover:text-cocoa-700'
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    );
  }

  return (
    <nav
      className="flex flex-col items-center gap-1 rounded-full border border-white/60 bg-white/70 backdrop-blur-sm px-2 py-3 shadow-soft"
      aria-label="Dashboard sections"
    >
      {sections.map(({ id, label, icon: Icon }) => (
        <div key={id} className="group relative">
          <button
            onClick={() => onNavigate(id)}
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
  );
}

function FooterActions({
  onLogout,
  onProfile,
  showLabels = false,
}: {
  onLogout: () => void;
  onProfile: () => void;
  showLabels?: boolean;
}) {
  if (showLabels) {
    return (
      <div className="flex w-full flex-col gap-1 px-3 mb-10 lg:mb-0">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cocoa-500 hover:bg-red-50 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Log out</span>
        </button>
        <button
          onClick={onProfile}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cocoa-500 hover:bg-peach-50 transition-colors"
        >
          <User size={18} className="shrink-0" />
          <span>Profile & settings</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-full bg-white/70 p-2 shadow-soft backdrop-blur-sm mb-10 lg:mb-0">
      <div className="group relative">
        <button
          onClick={onLogout}
          aria-label="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cocoa-400 hover:bg-red-50 hover:text-red-400 transition-colors"
        >
          <LogOut size={17} />
        </button>
        <SidebarTooltip label="Log out" />
      </div>

      <div className="group relative">
        <button
          onClick={onProfile}
          aria-label="Profile & settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cocoa-500 hover:bg-peach-50"
        >
          <User size={17} />
        </button>
        <SidebarTooltip label="Profile & settings" />
      </div>
    </div>
  );
}

export default function Sidebar() {
  const activeSection = useUIStore((s) => s.activeSection);
  const scrollTo = useScrollToSection();
  const open = useOverlayStore((s) => s.open);
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
const initial = user?.displayName?.charAt(0).toUpperCase() ?? 'U';

const handleLogout = async () => {
  await logOut();
  router.push('/login');
};
  const handleProfile = () => open('profileSettings');

  const handleNavigate = (id: string) => {
    setMobileOpen(false);

    if (pathname === DASHBOARD_PATH) {
      // Already on the dashboard — just scroll.
      scrollTo(id);
      return;
    }

    // On a different page (e.g. /dashboard/journal): stash the target
    // section, navigate to the dashboard, and let it consume + scroll.
    sessionStorage.setItem(PENDING_SCROLL_KEY, id);
    router.push(DASHBOARD_PATH);
  };

  return (
    <>
      {/* ---------- DESKTOP SIDEBAR (always visible, md and up) ---------- */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-20 shrink-0 flex-col items-center justify-between bg-peach-100 py-6 md:flex">
        <div className="flex flex-col items-center gap-1">
<div className="mb-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-soft text-peach-500">
  {user?.photoURL ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.photoURL} alt={user.displayName ?? 'Profile'} className="h-full w-full object-cover" />
  ) : (
    <span className="font-script text-2xl">{initial}</span>
  )}
</div>
          <NavLinks activeSection={activeSection} onNavigate={handleNavigate} />
        </div>
        <FooterActions onLogout={handleLogout} onProfile={handleProfile} />
      </aside>

      {/* ---------- MOBILE TOP NAVBAR: hamburger left, M right ---------- */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-peach-100/30 backdrop-blur-sm px-4 py-3 shadow-soft md:hidden rounded-2xl mx-4 mt-4">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cocoa-600 shadow-soft"
        >
          <Menu size={18} />
        </button>

        <AnimatePresence>
          {!mobileOpen && (
            <motion.div
              layoutId="logo-m"
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft text-peach-500"
            >
              <span className="font-script text-xl">M</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- MOBILE DRAWER ---------- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-cocoa-800/30 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-36 flex-col items-center justify-between bg-peach-100/90 py-6 md:hidden rounded-r-2xl shadow-soft"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-cocoa-400 shadow-soft"
              >
                <X size={14} />
              </button>

              <div className="flex w-full flex-col items-center gap-4">
<motion.div
  layoutId="logo-m"
  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
  className="mb-2 mt-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-soft text-peach-500"
>
  {user?.photoURL ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.photoURL}
      alt={user.displayName ?? 'Profile'}
      className="h-full w-full object-cover"
    />
  ) : (
    <span className="font-script text-2xl">{initial}</span>
  )}
</motion.div>

                <NavLinks activeSection={activeSection} onNavigate={handleNavigate} showLabels />
              </div>

              <FooterActions onLogout={handleLogout} onProfile={handleProfile} showLabels />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}