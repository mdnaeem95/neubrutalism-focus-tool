import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const TIMER_NOTIFICATION_ID = 'timer-phase-end';
const DAILY_REMINDER_ID = 'daily-reminder';

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleTimerNotification(
  secondsFromNow: number,
  phase: string,
  soundEnabled: boolean = true
) {
  await cancelTimerNotification();

  return Notifications.scheduleNotificationAsync({
    identifier: TIMER_NOTIFICATION_ID,
    content: {
      title: phase === 'work' ? 'Focus session complete!' : 'Break is over!',
      body:
        phase === 'work'
          ? 'Great work! Time for a break.'
          : 'Ready to focus again?',
      sound: soundEnabled,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, secondsFromNow),
    },
  });
}

export async function cancelTimerNotification() {
  try {
    await Notifications.cancelScheduledNotificationAsync(TIMER_NOTIFICATION_ID);
  } catch {
    // Notification may not exist yet — safe to ignore
  }
}

export async function scheduleDailyReminder(hour: number, minute: number) {
  await cancelDailyReminder();

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Time to focus!',
      body: 'Start a session in Fokus.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: true,
    },
  });
}

export async function cancelDailyReminder() {
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
  } catch {
    // Notification may not exist yet — safe to ignore
  }
}
