import { configureStore } from "@reduxjs/toolkit"
import questionnaireReducer from "./answerSlice"
//TODO 1 correct typoes once all is done and edit comments to be more clear if needed
//this creates adn configures the redux store
export const store = configureStore({
    reducer: {
        //this reducer combines all the slice reducers into one object
        questionnaire: questionnaireReducer,
        //we can add more reducers here if we need in the future
    },
})

//typescript type of the whole redux state
export type RootState = ReturnType<typeof store.getState>
//ts type for the dispatch function to check if an action is valid
export type AppDispatch = typeof store.dispatch