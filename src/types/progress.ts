// Versioned, position-independent progress model. Questions are always tracked
// by their stable string id, never by array index, so adding questions later
// never disturbs existing progress.

export interface UserProgress {
  version: 1;
  discussedQuestionIds: string[];
  favoriteQuestionIds: string[];
}

export const EMPTY_PROGRESS: UserProgress = {
  version: 1,
  discussedQuestionIds: [],
  favoriteQuestionIds: []
};
