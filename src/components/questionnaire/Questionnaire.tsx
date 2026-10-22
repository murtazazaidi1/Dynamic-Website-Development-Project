import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import type { Questionnaire as QuestionnaireData } from "../../types/questionnaire";
import QuestionnairePage from "./QuestionnairePage";
import FinalReport from "../results/FinalReport";

interface QuestionnaireProps {
  questionnaire: QuestionnaireData;
}

function Questionnaire({ questionnaire }: QuestionnaireProps) {
  const [tabIndex, setTabIndex] = useState(0);

  const pages = [...questionnaire.pages].sort((a, b) => a.order - b.order);

  return (
    <Box>
      <Tabs
        value={tabIndex}
        onChange={(_, newIndex: number) => setTabIndex(newIndex)}
        variant="scrollable"
      >
        {pages.map((page) => (
          <Tab key={page.id} label={page.title} />
        ))}
        <Tab label={questionnaire.results.title} />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tabIndex < pages.length ? (
          <QuestionnairePage page={pages[tabIndex]} questionnaire={questionnaire} />
        ) : (
          <FinalReport questionnaire={questionnaire} />
        )}
      </Box>
    </Box>
  );
}

export default Questionnaire;