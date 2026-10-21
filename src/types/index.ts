// ============================================================================
// QUESTION TYPES
// ============================================================================

export type QuestionType =
    | 'text'
    | 'slider'
    | 'radio'
    | 'select'
    | 'multiselect'
    | 'date'

export interface Option{
    value: number
    label: string
}

