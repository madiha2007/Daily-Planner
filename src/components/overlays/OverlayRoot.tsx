'use client';

import { AnimatePresence } from 'framer-motion';
import { useOverlayStore } from '@/stores/useOverlayStore';

import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import AddHabitModal from './AddHabitModal';
import EditHabitModal from './EditHabitModal';
import AddGoalModal from './AddGoalModal';
import AddJournalModal from './AddJournalModal';
import DayDetailsDrawer from './DayDetailsDrawer';
import AnalyticsBreakdownDrawer from './AnalyticsBreakdownDrawer';
import GoalDetailsDrawer from './GoalDetailsDrawer';
import ProfileSettingsModal from './ProfileSettingsModal';

export default function OverlayRoot() {
  const activeOverlay = useOverlayStore((s) => s.activeOverlay);

  return (
    <AnimatePresence>
      {activeOverlay === 'addTask' && <AddTaskModal key="addTask" />}
      {activeOverlay === 'editTask' && <EditTaskModal key="editTask" />}
      {activeOverlay === 'deleteTask' && <DeleteConfirmModal key="deleteTask" />}
      {activeOverlay === 'addHabit' && <AddHabitModal key="addHabit" />}
      {activeOverlay === 'editHabit' && <EditHabitModal key="editHabit" />}
      {activeOverlay === 'addGoal' && <AddGoalModal key="addGoal" />}
      {activeOverlay === 'addJournal' && <AddJournalModal key="addJournal" />}
      {activeOverlay === 'dayDetails' && <DayDetailsDrawer key="dayDetails" />}
      {activeOverlay === 'analyticsBreakdown' && <AnalyticsBreakdownDrawer key="analyticsBreakdown" />}
      {activeOverlay === 'goalDetails' && <GoalDetailsDrawer key="goalDetails" />}
      {activeOverlay === 'profileSettings' && <ProfileSettingsModal key="profileSettings" />}
    </AnimatePresence>
  );
}