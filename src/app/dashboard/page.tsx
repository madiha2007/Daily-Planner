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
    <DashboardShell headerRight={<OverviewSection />}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TasksSection />
        </div>
        <div>
          <CalendarSection />
        </div>
      </div>

      

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <JournalSection />
        </div>
        <div>
          <HabitsSection />
        </div>
      </div>

        <HeatmapSection />

      <AnalyticsSection />
      <GoalsSection />
      
      <OverlayRoot />
    </DashboardShell>
  );
}