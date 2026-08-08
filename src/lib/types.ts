export interface Task {
  id: string;
  title: string;
  notes?: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string; // ISO date string
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  targetPerWeek: number;
  completions: string[]; // array of ISO date strings when marked done
  color: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'low' | 'rough';
  color: string;       // id from JOURNAL_COLORS
  stickers: string[];  // up to 6 emoji
  image?: string;      // optional image URL
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number; // 0-100
  targetDate: string;
  milestones: { id: string; label: string; done: boolean }[];
  createdAt: string;
}

export interface DayActivity {
  date: string; // ISO date, yyyy-MM-dd
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  timezone: string;
}
