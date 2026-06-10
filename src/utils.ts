import { Question, PlayerAnswer } from './types';

// Formulas:
// Easy: 50 base. Medium: 100 base. Hard: 150 base.
// Hint Penalty: 20 points
// Wrong Answer Penalty: 30 points
// Max Penalty: cannot reduce score earned below 10% of base points (protection to keep some positive reinforcement!)
// Time Limit: 60s per question. Over 60s drops 10 points. If answered in <= 15 seconds, earns a speed bonus of +10 points!
export function calculateQuestionScore(
  question: Question,
  usedHint: boolean,
  wrongAttemptsCount: number,
  timeSpentInSeconds: number
): number {
  let score = question.points;

  if (usedHint) {
    score -= 20;
  }

  score -= (wrongAttemptsCount * 30);

  if (timeSpentInSeconds > 60) {
    score -= 10;
  } else if (timeSpentInSeconds <= 15) {
    score += 10; // Speed developer bonus!
  }

  // Floor safe limit: 10% of base points
  const minScore = Math.round(question.points * 0.1);
  return Math.max(score, minScore);
}

// Group answers by learning topic to compute stats
export function aggregateTopicStats(answers: PlayerAnswer[]): Record<string, { correct: number; total: number }> {
  const result: Record<string, { correct: number; total: number }> = {};
  
  answers.forEach((ans) => {
    if (!result[ans.topic]) {
      result[ans.topic] = { correct: 0, total: 0 };
    }
    result[ans.topic].total += 1;
    if (ans.isCorrect) {
      result[ans.topic].correct += 1;
    }
  });

  return result;
}

// Convert seconds count into MM:SS format
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatDateString(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    return 'เมื่อไม่กี่วินาทีที่แล้ว';
  }
}
