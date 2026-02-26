import { TimerPreset } from '../types/preset';
import { TaskCategory } from '../types/category';

export const DEFAULT_WORK_MINUTES = 25;
export const DEFAULT_SHORT_BREAK_MINUTES = 5;
export const DEFAULT_LONG_BREAK_MINUTES = 15;
export const DEFAULT_SESSIONS_BEFORE_LONG_BREAK = 4;
export const FREE_TIER_MAX_TASKS = 10;
export const FOCUS_SCORE_PENALTY = 15;

export const PRIVACY_POLICY_URL = 'https://neubrut-website.vercel.app/legal/privacy-fokus';
export const TERMS_OF_USE_URL = 'https://neubrut-website.vercel.app/legal/terms-fokus';

// Timer Presets
export const BUILT_IN_PRESETS: TimerPreset[] = [
  { id: 'quick', name: 'Quick', work: 15, shortBreak: 3, longBreak: 10, isBuiltIn: true },
  { id: 'standard', name: 'Standard', work: 25, shortBreak: 5, longBreak: 15, isBuiltIn: true },
  { id: 'long', name: 'Long', work: 50, shortBreak: 10, longBreak: 20, isBuiltIn: true },
];
export const MAX_CUSTOM_PRESETS_PRO = 5;

// Task Categories
export const BUILT_IN_CATEGORIES: TaskCategory[] = [
  { id: 'work', name: 'Work', color: '#4D96FF', icon: 'briefcase-outline', isBuiltIn: true },
  { id: 'personal', name: 'Personal', color: '#FF6B9D', icon: 'account-outline', isBuiltIn: true },
  { id: 'health', name: 'Health', color: '#6BCB77', icon: 'heart-outline', isBuiltIn: true },
  { id: 'learning', name: 'Learning', color: '#FFD93D', icon: 'school-outline', isBuiltIn: true },
  { id: 'errands', name: 'Errands', color: '#FF8C42', icon: 'cart-outline', isBuiltIn: true },
];

// Review Prompt
export const REVIEW_FIRST_PROMPT_SESSIONS = 5;
export const REVIEW_SUBSEQUENT_INTERVAL = 20;
export const REVIEW_MIN_DAYS_BETWEEN = 30;
export const REVIEW_MAX_PROMPTS = 3;
