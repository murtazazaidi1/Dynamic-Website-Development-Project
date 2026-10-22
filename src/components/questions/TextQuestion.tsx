import { TextField } from "@mui/material";
import type { Question } from "../../types/questionnaire";

interface TextQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

function TextQuestion({ question, value, onChange }: TextQuestionProps) {
  return (
    <TextField
      fullWidth
      multiline
      placeholder={question.placeholder}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default TextQuestion;