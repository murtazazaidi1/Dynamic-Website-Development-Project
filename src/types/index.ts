// ============================================================================
// QUESTION TYPES
// ============================================================================
//TODO 1correct any typoes
//TODO 2 check back if pushed code on github clashes with this ugh >:(
//TODO 3 check back on all the types and such once all branches are merged
export type QuestionType =
    | 'text'
    | 'slider'
    | 'radio'
    | 'select'
    | 'multiselect'
    | 'date'

export interface Option{
    value: number | string
    label: string
}

export interface Question{
    id: string
    type: QuestionType
    categoryId: string
    text: string
    required: boolean
    scored: boolean
    order: number
    //below are the properties for specific types of questions, like min value for slider and such
    options?: Option[]
    min?: number
    max?: number
    step?: number
    placeholder?: string
}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface Category{
    id: string
    pageId: string
    parentId: string | null
    title: string
    order: number
}

// ============================================================================
// PAGE STUFF
// ============================================================================

export interface Page{
    id: string
    title: string
    order: number
}

export interface Introduction{
    heading: string
    text: string
    instructions: string
}

// ============================================================================
// RESULTS
// ============================================================================

export interface ResultsConfig{
    title: string
    calculation: {
        method: string
        rounding: string
        excludeUnanswered: boolean
        includeNestedQuestionsInParent: boolean
    }
    radarChart: {
        enabled: boolean
        min: number
        max: number
    }
    showNonScoredAnswers: boolean
    allowPrint: boolean
}

// ============================================================================
// QUESTIONNAIRE
// ============================================================================

export interface QuestionnaireConfig{
    id: string
    title: string
    description: string
    version: string
    introduction: Introduction
    pages: Page[]
    categories: Category[]
    questions: Record<string, Question>
    results: ResultsConfig
}

// ============================================================================
// ANSWERS
// ============================================================================

export type AnswerValue =
    | string
    | number
    | string[]
    | Date

export interface Answers{
    [questionId: string]: AnswerValue
}

// ============================================================================
// REDUX
// ============================================================================

export interface QuestionnaireState{
    config: QuestionnaireConfig | null
    answers: Answers | null
    currentPage: string
}

// ============================================================================
// RADAR CHART
// ============================================================================

export interface RadarChartData{
    category: string
    value: number
}

export interface TextAnswerData{
    questionId: string
    questionText: string
    answer: AnswerValue
}