import { Lead } from '@prisma/client';

export class OfferEngine {
  static recommend(lead: Partial<Lead>) {
    const noSite = !lead.hasWebsite;
    const goodRating = (lead.rating ?? 0) >= 4.0;
    const manyReviews = (lead.reviewsCount ?? 0) > 50;

    if (noSite && goodRating && manyReviews) {
      return { service: "Pacote Completo (Site + Instagram + Tráfego)", confidence: 0.9, reasoning: "Empresa bem avaliada, mas não possui site oficial." };
    }
    if (noSite && goodRating) {
      return { service: "Site Profissional + Gestão de Instagram", confidence: 0.85, reasoning: "Boa avaliação, ótimo potencial com site e redes estruturadas." };
    }
    if (noSite) {
      return { service: "Site Profissional", confidence: 0.8, reasoning: "Ausência de site oficial pode custar clientes na busca do Google." };
    }
    if (goodRating && manyReviews) {
      return { service: "Tráfego Pago", confidence: 0.7, reasoning: "Presença digital já estabelecida, potencial para maximizar leads com ads." };
    }
    return { service: "Consultoria Digital", confidence: 0.6, reasoning: "Rever posicionamento." };
  }
}
