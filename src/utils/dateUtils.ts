export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => getDaysAgo(6 - i));
}

export function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) => getDaysAgo(29 - i));
}

export function getDayLabel(dateKey: string): string {
  const date = new Date(dateKey + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}
