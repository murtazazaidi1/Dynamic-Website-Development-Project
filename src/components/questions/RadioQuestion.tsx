import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import type { Question } from "../../types/questionnaire";

interface RadioQuestionProps {
  question: Question;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}

function RadioQuestion({ question, value, onChange }: RadioQuestionProps) {
  const options = question.options ?? [];

  const handleChange = (selected: string) => {
    const option = options.find((o) => String(o.value) === selected);
    if (option) {
      onChange(option.value);
    }
  };

  return (
    <FormControl>
      <RadioGroup
        value={value === undefined ? "" : String(value)}
        onChange={(event) => handleChange(event.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={String(option.value)}
            value={String(option.value)}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default RadioQuestion;