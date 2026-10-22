import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { QuestionnaireConfig, Answers, QuestionnaireState} from "../types"

//from what i found online and learned from AI and all, the intial state has to be null as redux neeeds a starting state
const initialState: QuestionnaireState = {
    config: null,
    answers: null,
    currentPage: ""
}

const questionnaireSlice = createSlice({
    name: "questionnaire",
    initialState,
    reducers: {
        //loads the questionnaire as seen in the name
        loadQuestionnaire: (state, action: PayloadAction<QuestionnaireConfig>) => {
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
            if (!state.answers) {
                state.answers = {}
            }
            state.answers[action.payload.questionId] = action.payload.answer
        },
        //multiple pages so we need this to naviate between them
        navigateToPage: (state, action: PayloadAction<string>) => {
            state.currentPage = action.payload
        },
        //resets the questionnaire if you wanna start from scratch
        resetQuestionnaire: (state) => {
            state.config = null
            state.answers = null
            state.currentPage = ""
        },
    },
})