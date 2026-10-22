import { TextField } from "@mui/material";
import type { Question } from "../../types/questionnaire";

interface DateQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

function DateQuestion({ value, onChange }: DateQuestionProps) {
  return (
    <TextField
      fullWidth
      type="date"
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default DateQuestion;