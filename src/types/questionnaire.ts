// I made TypeScript interfaces for the questionnaire JSON structure.
// These types will be used by the questionnaire, question and results components.

export interface QuestionOption {
  label: string;
  value: string | number;
}

export type QuestionType =
  | "text"
  | "radio"
  | "multiselect"
  | "select"
  | "slider"
  | "date";

export interface Question {
  categoryId: string;
  type: QuestionType;
  text: string;
  required: boolean;
  scored: boolean;
  order: number;

  options?: QuestionOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface QuestionnairePage {
  id: string;
  title: string;
  order: number;
}

export interface Category {
  id: string;
  pageId: string;
  parentId: string | null;
  title: string;
  order: number;
}

export interface QuestionnaireIntroduction {
  heading: string;
  text: string;
  instructions: string;
}

export interface QuestionnaireResults {
  title: string;
  calculation: {
    method: "average";
    rounding: "nearest-integer";
    excludeUnanswered: boolean;
    includeNestedQuestionsInParent: boolean;
  };
  radarChart: {
    enabled: boolean;
    min: number;
    max: number;
  };
  showNonScoredAnswers: boolean;
  allowPrint: boolean;
}

export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  version: string;
  introduction: QuestionnaireIntroduction;
  pages: QuestionnairePage[];
  categories: Category[];
  questions: Record<string, Question>;
  results: QuestionnaireResults;
}
