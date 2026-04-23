import { Lead } from '@prisma/client';

export interface ScoreRule {
  name: string;
  points: number;
  condition: (lead: Partial<Lead>) => boolean;
}

const PRIORITY_NICHES = ['barbearia', 'salão de beleza', 'restaurante', 'clinica'];

export const RULES: ScoreRule[] = [
  { name: "Sem site",               points: 40, condition: (l) => !l.hasWebsite },
  { name: "Nota acima de 4.3",      points: 20, condition: (l) => (l.rating ?? 0) >= 4.3 },
  { name: "Mais de 50 avaliações",  points: 20, condition: (l) => (l.reviewsCount ?? 0) > 50 },
  { name: "Nicho prioritário",      points: 10, condition: (l) => PRIORITY_NICHES.some(niche => l.category?.toLowerCase().includes(niche)) },
  { name: "Tem telefone",           points: 10, condition: (l) => !!l.phone },
];
