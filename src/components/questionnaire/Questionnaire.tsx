import { useState, useEffect } from "react";
import { Box, Tab, Tabs, Button, Stack } from "@mui/material";
import type { Questionnaire as QuestionnaireData } from "../../types/questionnaire";
import QuestionnairePage from "./QuestionnairePage";
import FinalReport from "../results/FinalReport";
import { useDispatch } from "react-redux";
import { clearAnswers } from "../../store/answerSlice";

interface QuestionnaireProps {
  questionnaire: QuestionnaireData;
}

function Questionnaire({ questionnaire }: QuestionnaireProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch();

  //this is so that the pages refreshes to the top when switching pages/tabs so the user doesnt have to scroll up #lazyyyy
  useEffect(() => {
      window.scrollTo(0, 0);
  }, [tabIndex])

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
      <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 3 }}>
      <Button
        variant="outlined"
        disabled={tabIndex === 0}
        onClick={() => setTabIndex(tabIndex - 1)}
      >
        Previous
      </Button>

      <Button
        variant="contained"
        disabled={tabIndex === pages.length}
        onClick={() => setTabIndex(tabIndex + 1)}
      >
        {tabIndex === pages.length - 1 ? "View Final Report" : "Next"}
      </Button>

      <Button
        variant="outlined"
        color="error"
        onClick={() => {
          if (window.confirm("Are you sure you want to clear all answers?")) {
            dispatch(clearAnswers());
          }
        }}
      >
        Clear Answers
      </Button>
    </Stack>
    </Box>
  );
}

export default Questionnaire;