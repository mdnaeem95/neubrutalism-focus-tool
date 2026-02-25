import { StateCreator } from 'zustand';
import * as Crypto from 'expo-crypto';
import { Task } from '../types/task';
import { FREE_TIER_MAX_TASKS } from '../utils/constants';

/** Minimal fields from other slices needed for cross-slice access. */
type SharedSlices = TaskSlice & { isPro: boolean };

export interface TaskSlice {
  tasks: Task[];
  taskLimitReached: boolean;

  addTask: (text: string, category?: string) => void;
  updateTaskCategory: (id: string, category: string | undefined) => void;
  editTask: (id: string, text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (fromIndex: number, toIndex: number) => void;
  assignTaskToSession: (id: string) => void;
  unassignTaskFromSession: (id: string) => void;
  clearCompletedTasks: () => void;
}

export const createTaskSlice: StateCreator<SharedSlices, [], [], TaskSlice> = (set, get) => ({
  tasks: [],
  taskLimitReached: false,

  addTask: (text, category) => {
    const state = get();
    const activeTasks = state.tasks.filter((t) => !t.completed).length;
    if (!state.isPro && activeTasks >= FREE_TIER_MAX_TASKS) {
      set({ taskLimitReached: true });
      return;
    }
    set((s) => ({
      taskLimitReached: false,
      tasks: [
        {
          id: Crypto.randomUUID(),
          text,
          completed: false,
          createdAt: Date.now(),
          order: s.tasks.length,
          assignedToSession: false,
          ...(category ? { category } : {}),
        },
        ...s.tasks,
      ],
    }));
  },

  updateTaskCategory: (id, category) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, category } : t
      ),
    })),

  editTask: (id, text) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, text } : t
      ),
    })),

  toggleTask: (id) =>
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
          : t
      );
      const activeCount = tasks.filter((t) => !t.completed).length;
      return {
        tasks,
        taskLimitReached: activeCount >= FREE_TIER_MAX_TASKS ? state.taskLimitReached : false,
      };
    }),

  deleteTask: (id) =>
    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== id);
      const activeCount = tasks.filter((t) => !t.completed).length;
      return {
        tasks,
        taskLimitReached: activeCount >= FREE_TIER_MAX_TASKS ? state.taskLimitReached : false,
      };
    }),

  reorderTasks: (fromIndex, toIndex) =>
    set((state) => {
      const tasks = [...state.tasks];
      const [moved] = tasks.splice(fromIndex, 1);
      tasks.splice(toIndex, 0, moved);
      return { tasks: tasks.map((t, i) => ({ ...t, order: i })) };
    }),

  assignTaskToSession: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, assignedToSession: true } : t
      ),
    })),

  unassignTaskFromSession: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, assignedToSession: false } : t
      ),
    })),

  clearCompletedTasks: () =>
    set((state) => ({
      tasks: state.tasks.filter((t) => !t.completed),
    })),
});
