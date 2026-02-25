import { useEffect, useRef } from 'react';
import * as StoreReview from 'expo-store-review';
import { useStore } from '../stores';
import {
  REVIEW_FIRST_PROMPT_SESSIONS,
  REVIEW_SUBSEQUENT_INTERVAL,
  REVIEW_MIN_DAYS_BETWEEN,
  REVIEW_MAX_PROMPTS,
} from '../utils/constants';

export function useReviewPrompt() {
  const totalSessions = useStore((s) => s.totalLifetimeSessions);
  const lastPromptDate = useStore((s) => s.lastReviewPromptDate);
  const promptCount = useStore((s) => s.reviewPromptCount);
  const recordReviewPrompt = useStore((s) => s.recordReviewPrompt);
  const prevSessions = useRef(totalSessions);

  useEffect(() => {
    // Only trigger on session increment (not initial mount or rehydration)
    if (totalSessions <= prevSessions.current) {
      prevSessions.current = totalSessions;
      return;
    }
    prevSessions.current = totalSessions;

    if (promptCount >= REVIEW_MAX_PROMPTS) return;

    // Check minimum days between prompts
    if (lastPromptDate) {
      const daysSinceLastPrompt = (Date.now() - lastPromptDate) / (1000 * 60 * 60 * 24);
      if (daysSinceLastPrompt < REVIEW_MIN_DAYS_BETWEEN) return;
    }

    // Check session threshold
    const shouldPrompt =
      (promptCount === 0 && totalSessions >= REVIEW_FIRST_PROMPT_SESSIONS) ||
      (promptCount > 0 &&
        totalSessions >= REVIEW_FIRST_PROMPT_SESSIONS + promptCount * REVIEW_SUBSEQUENT_INTERVAL);

    if (shouldPrompt) {
      StoreReview.isAvailableAsync().then((available) => {
        if (available) {
          StoreReview.requestReview();
          recordReviewPrompt();
        }
      });
    }
  }, [totalSessions]);
}
