import { Box } from "@mui/material";
import type { Questionnaire, QuestionnairePage as PageData } from "../../types/questionnaire";
import Category from "./Category";
import PageResults from "../results/PageResults";

interface QuestionnairePageProps {
  page: PageData;
  questionnaire: Questionnaire;
}

function QuestionnairePage({ page, questionnaire }: QuestionnairePageProps) {
  const topCategories = questionnaire.categories
    .filter((category) => category.pageId === page.id && category.parentId === null)
    .sort((a, b) => a.order - b.order);

  return (
    <Box>
      {topCategories.map((category) => (
        <Category key={category.id} category={category} questionnaire={questionnaire} />
      ))}

      <PageResults page={page} questionnaire={questionnaire} />
    </Box>
  );
}

export default QuestionnairePage;