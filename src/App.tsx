
import { useState, useEffect } from "react";
import type { Questionnaire } from "./types/questionnaire";
import { loadQuestionnaire } from "./services/questionnaireLoader";
import QuestionnaireView from "./components/questionnaire/Questionnaire";
import { useDispatch } from "react-redux";
import { loadQuestionnaire as setReduxQuestionnaire } from "./store/answerSlice";
import "./App.css";

function App() {
  // so it will store the questionnaire after loading it
  const dispatch = useDispatch();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [error, setError] = useState("");

  // Loads the JSON when the page opens by user
  useEffect(() => {
    loadQuestionnaire()
    .then((data) => {
      setQuestionnaire(data);
      dispatch(setReduxQuestionnaire(data));
    })
      .catch(() => {
        setError("Something went wrong while loading the questionnaire.");
      });
  }, [dispatch]);

  // I added this so that the user can see if there is an error while loading the JSON
  if (error) {
    return <p>{error}</p>;
  }

  // So that the user can see that the questionnaire is loading
  if (!questionnaire) {
    return <p>Loading questionnaire...</p>;
  }

  return (
    <div>
      <h1>{questionnaire.title}</h1>
      <p>{questionnaire.description}</p>

      <h2>{questionnaire.introduction.heading}</h2>
      <p>{questionnaire.introduction.text}</p>
      <p>{questionnaire.introduction.instructions}</p>

<QuestionnaireView questionnaire={questionnaire} />
    </div>
  );
}

export default App;
