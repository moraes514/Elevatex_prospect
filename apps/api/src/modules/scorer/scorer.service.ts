import { Lead } from '@prisma/client';
import { RULES } from './scorer.rules';

export class ScorerService {
  static calculateScore(lead: Partial<Lead>) {
    let totalScore = 0;
    const reasons: string[] = [];

    RULES.forEach(rule => {
      if (rule.condition(lead)) {
        totalScore += rule.points;
        reasons.push(rule.name);
      }
    });

    let classification = "fraco";
    if (totalScore >= 80) classification = "quente";
    else if (totalScore >= 60) classification = "bom";

    return {
      score: totalScore,
      classification,
      scoreReason: JSON.stringify(reasons)
    };
  }
}
