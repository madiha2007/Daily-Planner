import { DayActivity } from '@/lib/types';
import { generateMockDayActivity } from '@/lib/mock/generateMockData';

const SIMULATED_DELAY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

let _activity: DayActivity[] | null = null;

export async function fetchDayActivity(days = 91): Promise<DayActivity[]> {
  if (!_activity) {
    _activity = generateMockDayActivity(days);
  }
  return delay([..._activity]);
}

export async function fetchDayActivityByDate(date: string): Promise<DayActivity | undefined> {
  if (!_activity) {
    _activity = generateMockDayActivity();
  }
  return delay(_activity.find((d) => d.date === date));
}
