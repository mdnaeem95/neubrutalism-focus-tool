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

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleTimerNotification(
  secondsFromNow: number,
  phase: string,
  soundEnabled: boolean = true
) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  return Notifications.scheduleNotificationAsync({
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
  await Notifications.cancelAllScheduledNotificationsAsync();
}
