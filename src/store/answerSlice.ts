import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Questionnaire, Answers, QuestionnaireState } from "../types/questionnaire"

//from what i found online and learned from AI and all, the intial state has to be null as redux neeeds a starting state
const initialState: QuestionnaireState = {
    config: null,
    answers: {},
    currentPage: ""
}

const answerSlice = createSlice({
    name: "questionnaire",
    initialState,
    reducers: {
        //loads the questionnaire as seen in the name
            loadQuestionnaire: (state, action: PayloadAction<Questionnaire>) => {
                state.config = action.payload
            //this sets the current page as the first one
            if(action.payload.pages.length > 0) {
                state.currentPage = action.payload.pages[0].id
            }
        },
        //save the answers so we can use them later on
        answerQuestion: (
            state,
                action: PayloadAction<{ questionId: string; answer: Answers[string] }>
        ) => {
            state.answers[action.payload.questionId] = action.payload.answer
        },
        //multiple pages so we need this to naviate between them
        navigateToPage: (state, action: PayloadAction<string>) => {
            state.currentPage = action.payload
        },
            clearAnswers: (state) => {
        state.answers = {}
    },
        //resets the questionnaire if you wanna start from scratch
        resetQuestionnaire: (state) => {
            state.config = null
            state.answers = {}
            state.currentPage = ""
        },
    },
})

export const { loadQuestionnaire, answerQuestion, navigateToPage, resetQuestionnaire, clearAnswers
} = answerSlice.actions

export default answerSlice.reducer