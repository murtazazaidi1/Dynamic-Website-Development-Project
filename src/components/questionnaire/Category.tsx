import { Box, Typography } from "@mui/material";
import type { Category as CategoryData, Questionnaire } from "../../types/questionnaire";
import QuestionRenderer from "../questions/QuestionRenderer";

interface CategoryProps {
  category: CategoryData;
  questionnaire: Questionnaire;
}

function Category({ category, questionnaire }: CategoryProps) {
  const subcategories = questionnaire.categories
    .filter((item) => item.parentId === category.id)
    .sort((a, b) => a.order - b.order);

  const questions = Object.entries(questionnaire.questions)
    .filter(([, question]) => question.categoryId === category.id)
    .sort(([, a], [, b]) => a.order - b.order);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {category.title}
      </Typography>

      {questions.map(([questionId, question]) => (
        <QuestionRenderer key={questionId} questionId={questionId} question={question} />
      ))}

      {subcategories.map((subcategory) => (
        <Category key={subcategory.id} category={subcategory} questionnaire={questionnaire} />
      ))}
    </Box>
  );
}

export default Category;