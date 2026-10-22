import { Checkbox, FormControl, FormControlLabel, FormGroup } from "@mui/material";
import type { Question } from "../../types/questionnaire";

interface MultiSelectQuestionProps {
  question: Question;
  value: (string | number)[] | undefined;
  onChange: (value: (string | number)[]) => void;
}

function MultiSelectQuestion({ question, value, onChange }: MultiSelectQuestionProps) {
  const options = question.options ?? [];
  const selected = value ?? [];

  const handleToggle = (optionValue: string | number, checked: boolean) => {
    if (checked) {
      onChange([...selected, optionValue]);
    } else {
      onChange(selected.filter((v) => v !== optionValue));
    }
  };

  return (
    <FormControl>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={String(option.value)}
            label={option.label}
            control={
              <Checkbox
                checked={selected.includes(option.value)}
                onChange={(event) => handleToggle(option.value, event.target.checked)}
              />
            }
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

export default MultiSelectQuestion;