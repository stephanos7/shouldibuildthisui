import { useLocation } from 'react-router-dom';
import ResultPage from '../features/result/ResultPage';
import type { QuestionnaireResultState } from '../features/questionnaire/questionnaireResultState';

export default function ResultRoute() {
  const location = useLocation();
  const state = location.state as QuestionnaireResultState | null;

  return <ResultPage state={state} />;
}
