import { useEffect } from 'react';
import { useStore } from '../stores';
import { scheduleDailyReminder, cancelDailyReminder } from './useNotifications';

export function useDailyReminder() {
  const enabled = useStore((s) => s.dailyReminderEnabled);
  const hour = useStore((s) => s.dailyReminderHour);
  const minute = useStore((s) => s.dailyReminderMinute);
  const notificationsEnabled = useStore((s) => s.notificationsEnabled);

  useEffect(() => {
    if (enabled && notificationsEnabled) {
      scheduleDailyReminder(hour, minute);
    } else {
      cancelDailyReminder();
    }
  }, [enabled, hour, minute, notificationsEnabled]);
}
