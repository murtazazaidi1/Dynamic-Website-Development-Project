import { Slider, Typography } from "@mui/material";
import type { Question } from "../../types/questionnaire";

interface SliderQuestionProps {
  question: Question;
  value: number | undefined;
  onChange: (value: number) => void;
}

function SliderQuestion({ question, value, onChange }: SliderQuestionProps) {
  const min = question.min ?? 0;
  const max = question.max ?? 10;
  const step = question.step ?? 1;

  return (
    <>
      <Slider
        min={min}
        max={max}
        step={step}
        marks
        valueLabelDisplay="auto"
        value={value ?? min}
        onChange={(_, newValue) => {
          if (typeof newValue === "number") {
            onChange(newValue);
          }
        }}
      />
      {value === undefined && (
        <Typography variant="caption" color="text.secondary">
          Not answered
        </Typography>
      )}
    </>
  );
}

export default SliderQuestion;