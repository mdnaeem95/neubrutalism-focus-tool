import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/task';
import { FREE_TIER_MAX_TASKS } from '../utils/constants';

export interface TaskSlice {
  tasks: Task[];
  taskLimitReached: boolean;

  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (fromIndex: number, toIndex: number) => void;
  assignTaskToSession: (id: string) => void;
  unassignTaskFromSession: (id: string) => void;
  clearCompletedTasks: () => void;
}

export const createTaskSlice: StateCreator<TaskSlice, [], [], TaskSlice> = (set, get) => ({
  tasks: [],
  taskLimitReached: false,

  addTask: (text) => {
    const state = get() as any;
    const activeTasks = state.tasks.filter((t: Task) => !t.completed).length;
    if (!state.isPro && activeTasks >= FREE_TIER_MAX_TASKS) {
      set({ taskLimitReached: true });
      return;
    }
    set((s) => ({
      taskLimitReached: false,
      tasks: [
        {
          id: uuidv4(),
          text,
          completed: false,
          createdAt: Date.now(),
          order: s.tasks.length,
          assignedToSession: false,
        },
        ...s.tasks,
      ],
    }));
  },

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
          : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

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
