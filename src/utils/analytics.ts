import PostHog from 'posthog-react-native';

let posthogClient: PostHog | null = null;

export function setPostHogClient(client: PostHog) {
  posthogClient = client;
}

function track(event: string, properties?: Record<string, string | number | boolean>) {
  posthogClient?.capture(event, properties);
}

export const analytics = {
  sessionCompleted: (durationMinutes: number, focusScore: number, phase: string) =>
    track('session_completed', { durationMinutes, focusScore, phase }),

  taskAdded: () => track('task_added'),

  taskCompleted: () => track('task_completed'),

  taskEdited: () => track('task_edited'),

  paywallViewed: (trigger: string) => track('paywall_viewed', { trigger }),

  purchaseCompleted: (plan: string) => track('purchase_completed', { plan }),

  statsShared: () => track('stats_shared'),

  dataExported: (format: string) => track('data_exported', { format }),

  onboardingCompleted: () => track('onboarding_completed'),

  settingsChanged: (setting: string, value: string | number | boolean) =>
    track('settings_changed', { setting, value }),
};
