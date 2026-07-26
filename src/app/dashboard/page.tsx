import DashboardShell from '@/components/layout/DashboardShell';
import OverlayRoot from '@/components/overlays/OverlayRoot';
import OverviewSection from '@/components/sections/OverviewSection';
import TasksSection from '@/components/sections/TasksSection';
import CalendarSection from '@/components/sections/CalendarSection';
import HabitsSection from '@/components/sections/HabitsSection';
import HeatmapSection from '@/components/sections/HeatmapSection';
import AnalyticsSection from '@/components/sections/AnalyticsSection';
import GoalsSection from '@/components/sections/GoalsSection';
import JournalSection from '@/components/sections/JournalSection';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <OverviewSection />
      <TasksSection />
      <CalendarSection />
      <HabitsSection />
      <HeatmapSection />
      <AnalyticsSection />
      <GoalsSection />
      <JournalSection />
      <OverlayRoot />
    </DashboardShell>
  );
}
