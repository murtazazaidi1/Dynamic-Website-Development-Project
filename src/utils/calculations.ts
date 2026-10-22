import type {
    Question,
    Answers,
    Category,
    Questionnaire,
    RadarChartData,
    TextAnswerData
} from "../types/questionnaire"

// ============================================================================
// this is the file for calculations
// ============================================================================
//TODO 1 same as other files... gotta cehck typoes and comments
//this checks if the question has numerical value answers as we cant use text in the radar chart
const isNumericalQuestion = (question: Question): boolean => {
    return ["slider", "radio", "select"].includes(question.type)
}

//convert to numbers so we can use them in calculations it'll return a numerical value or 0 if the parsing fails
const answerToNumber = (answer: Answers[string]): number | null => {
    if (typeof answer === "number") {
        return Number.isFinite(answer) ? answer : null
    }

    if (typeof answer === "string" && answer.trim() !== "") {
        const parsed = Number(answer)
        if (Number.isFinite(parsed)) return parsed
    }

    return null
}

//find child categories, including nested categories
const getChildCategoryIds = (
    categoryId: string,
    categories: Category[]
): string[] => {
    const ids = [categoryId]

    for (const category of categories) {
        if (category.parentId === categoryId) {
            ids.push(...getChildCategoryIds(category.id, categories))
        }
    }

    return ids
}

//calculate average score for a category
export const calculateCategoryScore = (
    categoryId: string,
    questionnaire: Questionnaire,
    answers: Answers
): number | null => {

    const categoryIds =
        questionnaire.results.calculation.includeNestedQuestionsInParent
            ? getChildCategoryIds(categoryId, questionnaire.categories)
            : [categoryId]

    const scores: number[] = []

    for (const [questionId, question] of Object.entries(questionnaire.questions)) {
        if (!categoryIds.includes(question.categoryId)) continue
        if (!question.scored || !isNumericalQuestion(question)) continue

        const answer = answers[questionId]

        if (answer === undefined || answer === "") continue

        const value = answerToNumber(answer)

        if (value !== null) {
            scores.push(value)
        }
    }

    if (scores.length === 0) return null

    const total = scores.reduce((sum, value) => sum + value, 0)
    return Math.round(total / scores.length)
}

//prepare radar chart data
export const calculateRadarChartData = (
    questionnaire: Questionnaire,
    answers: Answers,
    pageId?: string
): RadarChartData[] => {

    const categories = pageId
        ? questionnaire.categories.filter(category => category.pageId === pageId)
        : questionnaire.categories

    const data: RadarChartData[] = []

    for (const category of categories) {
        const score = calculateCategoryScore(category.id, questionnaire, answers)

        if (score !== null) {
            data.push({
                category: category.title,
                value: score
            })
        }
    }

    return data
}

//collect non-scored answers
export const getTextAnswers = (
    questionnaire: Questionnaire,
    answers: Answers
): TextAnswerData[] => {

    const data: TextAnswerData[] = []

    for (const [questionId, question] of Object.entries(questionnaire.questions)) {
        if (question.scored) continue

        const answer = answers[questionId]

        if (answer === undefined || answer === "" ||
            (Array.isArray(answer) && answer.length === 0)) {
            continue
        }

        data.push({
            questionId,
            questionText: question.text,
            answer
        })
    }

    return data
}