import { RootState } from "../store/store.ts"
import { Question, Answers, Category, QuestionnaireConfig, RadarChartData, TextAnswerData} from "../types"

// ============================================================================
// this is the file for calculations
// ============================================================================
//TODO 1 same as other files... gotta cehck typoes and comments
//this checks if the question has numerical value answers as we cant use text in the radar chart
const isNumericalQuestion = (question: Question): boolean => {
    return ["slider", "radio", "select"].includes(question.type)
}

//convert to numbers so we can use them in calculations it'll return a numerical value or 0 if the parsing fails
const answerToNumber = (answer: any, question: Question): number => {
    if (typeof answer === "number") return answer
//try to parse the answer to a number if not already a numerical value
    if (typeof answer === "string") {
        const parsed = parseFloat(answer)
        if (!isNaN(parsed)) return parsed
    }
}