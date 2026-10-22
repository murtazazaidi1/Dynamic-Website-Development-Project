
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

import type { Question } from "../../types/questionnaire";
import type { RootState } from "../../store/store";
import { answerQuestion } from "../../store/answerSlice";

import TextQuestion from "./TextQuestion";
import RadioQuestion from "./RadioQuestion";
import MultiSelectQuestion from "./MultiSelectQuestion";
import SelectQuestion from "./SelectQuestion";
import SliderQuestion from "./SliderQuestion";
import DateQuestion from "./DateQuestion";

interface Props {
  questionId: string;
  question: Question;
}

function QuestionRenderer({ questionId, question }: Props) {

  const dispatch = useDispatch();

  // Get the saved answer for this question
  const answer = useSelector(
    (state: RootState) => state.questionnaire.answers[questionId]
  );

  // Save the answer whenever the user changes it
    function changeAnswer(value: string | number | (string | number)[]) {
      dispatch(answerQuestion({ questionId, answer: value }));
    }
  let questionInput;

  if (question.type === "text") {
    questionInput = (
      <TextQuestion
        question={question}
        value={typeof answer === "string" ? answer : undefined}
        onChange={changeAnswer}
      />
    );
  }

  else if (question.type === "radio") {
    questionInput = (
      <RadioQuestion
        question={question}
        value={typeof answer === "string" || typeof answer === "number" ? answer : undefined}
        onChange={changeAnswer}
      />
    );
  }

  else if (question.type === "multiselect") {
    questionInput = (
      <MultiSelectQuestion
        question={question}
        value={Array.isArray(answer) ? answer : []}
        onChange={changeAnswer}
      />
    );
  }

  else if (question.type === "select") {
    questionInput = (
      <SelectQuestion
        question={question}
        value={typeof answer === "string" || typeof answer === "number" ? answer : undefined}
        onChange={changeAnswer}
      />
    );
  }

  else if (question.type === "slider") {
    questionInput = (
      <SliderQuestion
        question={question}
        value={typeof answer === "number" ? answer : undefined}
        onChange={changeAnswer}
      />
    );
  }

  else if (question.type === "date") {
    questionInput = (
      <DateQuestion
        question={question}
        value={typeof answer === "string" ? answer : undefined}
        onChange={changeAnswer}
      />
    );
  }

  else {
    questionInput = <p>Question type not supported</p>;
  }

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography sx={{ marginBottom: 1 }}>
        {question.text} {question.required && "*"}
      </Typography>

      {questionInput}
    </Box>
  );
}

export default QuestionRenderer;
