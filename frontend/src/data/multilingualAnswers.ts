import rawData from "./multilingualAnswers.json";

export interface AnswerTranslations {
  ta: string;
  en?: string;
  ml?: string;
  kn?: string;
  te?: string;
  hi?: string;
}

export interface MultilingualAnswersStore {
  common: Record<string, AnswerTranslations>;
  casteDenial: Record<string, AnswerTranslations>;
}

export const multilingualAnswers: MultilingualAnswersStore = rawData as MultilingualAnswersStore;
