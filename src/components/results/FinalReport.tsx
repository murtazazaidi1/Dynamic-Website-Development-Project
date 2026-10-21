import { useSelector } from 'react-redux';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import type { Questionnaire } from '../../types/questionnaire';
//import type { RootState } from '../../store/store';
import PageResults from './PageResults';

type Props = { questionnaire: Questionnaire };

function FinalReport({ questionnaire }: Props) {
  // const answers = useSelector((state: RootState) => state.answers.answers);
  const questionIds = Object.keys(questionnaire.questions);
  let answeredCount = 0;

  for (const id of questionIds) {
    // const answer = answers[id];
    // if (answer !== undefined && answer !== '' && (!Array.isArray(answer) || answer.length > 0)) {
    //   answeredCount++;
    // }
  }

  const pages = [...questionnaire.pages];
  pages.sort((a, b) => a.order - b.order);

  return (
    <Box className="final-report">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4">{questionnaire.results.title}</Typography>
        <Typography>Questions answered: {answeredCount} / {questionIds.length}</Typography>
        <Divider sx={{ my: 2 }} />
        {pages.map(page => (
          <PageResults key={page.id} page={page} questionnaire={questionnaire} />
        ))}
        {questionnaire.results.allowPrint && (
          <Button className="no-print" variant="contained" sx={{ mt: 3 }}
            onClick={() => window.print()}>
            Print / Save as PDF
          </Button>
        )}
      </Paper>
    </Box>
  );
}

export default FinalReport;
