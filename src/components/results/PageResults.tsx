import { useSelector } from 'react-redux';
import { Box, Paper, Typography } from '@mui/material';
import type { Questionnaire, QuestionnairePage } from '../../types/questionnaire';
import type { RootState } from '../../store/store';
import { calculateCategoryScore } from '../../utils/calculations';
import RadarChart from './RadarChart';

type Props = { page: QuestionnairePage; questionnaire: Questionnaire };

function PageResults({ page, questionnaire }: Props) {
  const answers = useSelector((state: RootState) => state.answers.answers);
  const pageCategories = questionnaire.categories.filter(category => category.pageId === page.id);

  const categoryScores = pageCategories.map(category => ({
    id: category.id,
    name: category.title,
    score: calculateCategoryScore(category.id, questionnaire, answers)
  }));

  const radarData: { name: string; score: number }[] = [];
  for (const category of categoryScores) {
    if (category.score !== null) {
      radarData.push({ name: category.name, score: category.score });
    }
  }

  const otherQuestions = Object.entries(questionnaire.questions).filter(([, question]) => {
    const belongsToPage = pageCategories.some(category => category.id === question.categoryId);
    return !question.scored && belongsToPage;
  });

  function showAnswer(id: string) {
    const answer = answers[id];
    if (answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
      return 'Not answered';
    }
    if (Array.isArray(answer)) {
      const question = questionnaire.questions[id];
      return answer.map(value => {
        const option = question.options?.find(item => String(item.value) === value);
        return option?.label ?? value;
      }).join(', ');
    }
    return String(answer);
  }

  return (
    <Paper className="page-results" sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5">Results — {page.title}</Typography>
      {categoryScores.map(category => (
        <Typography key={category.id}>
          {category.name}: {category.score ?? 'Not answered'}
        </Typography>
      ))}

      {questionnaire.results.radarChart.enabled && (
        <RadarChart data={radarData} min={questionnaire.results.radarChart.min}
          max={questionnaire.results.radarChart.max} />
      )}

      {questionnaire.results.showNonScoredAnswers && otherQuestions.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Other Answers</Typography>
          {otherQuestions.map(([id, question]) => (
            <Box key={id} sx={{ my: 1 }}>
              <Typography sx={{ fontWeight: 'bold' }}>{question.text}</Typography>
              <Typography>{showAnswer(id)}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}

export default PageResults;
