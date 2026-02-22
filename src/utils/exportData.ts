import { Share } from 'react-native';
import { Task } from '../types/task';
import { DayStats } from '../types/stats';

interface ExportPayload {
  tasks: Task[];
  dailyStats: Record<string, DayStats>;
  totalLifetimeSessions: number;
  totalLifetimeMinutes: number;
  currentStreak: number;
  longestStreak: number;
}

export async function exportDataAsJSON(data: ExportPayload): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await Share.share({
    title: 'Fokus Data Export',
    message: json,
  });
}

export async function exportDataAsCSV(data: ExportPayload): Promise<void> {
  const lines = ['Date,Sessions,Focus Minutes,Avg Focus Score'];
  const sortedDates = Object.keys(data.dailyStats).sort();
  for (const date of sortedDates) {
    const day = data.dailyStats[date];
    lines.push(
      `${day.date},${day.sessionsCompleted},${day.totalFocusMinutes},${day.averageFocusScore}`
    );
  }
  await Share.share({
    title: 'Fokus Stats Export',
    message: lines.join('\n'),
  });
}

export async function shareStats(stats: {
  totalSessions: number;
  totalHours: string;
  currentStreak: number;
  avgFocusScore: number;
}): Promise<void> {
  const message = [
    'My Fokus Stats',
    `${stats.totalSessions} sessions completed`,
    `${stats.totalHours} hours focused`,
    `${stats.currentStreak} day streak`,
    `${stats.avgFocusScore}% avg focus score`,
  ].join('\n');

  await Share.share({ message });
}
