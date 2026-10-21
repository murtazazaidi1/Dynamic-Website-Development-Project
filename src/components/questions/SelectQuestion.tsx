import { FormControl, MenuItem, Select } from "@mui/material";
import type { Question } from "../../types/questionnaire";

interface SelectQuestionProps {
  question: Question;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}

function SelectQuestion({ question, value, onChange }: SelectQuestionProps) {
  const options = question.options ?? [];

  const handleChange = (selected: string) => {
    const option = options.find((o) => String(o.value) === selected);
    if (option) {
      onChange(option.value);
    }
  };

  return (
    <FormControl fullWidth>
      <Select
        value={value === undefined ? "" : String(value)}
        onChange={(event) => handleChange(event.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectQuestion;