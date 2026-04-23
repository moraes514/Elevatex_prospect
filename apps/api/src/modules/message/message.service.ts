import { Lead } from '@prisma/client';

export class MessageEngine {
  static generateMessage(lead: Partial<Lead>, service: string): string {
    const noSiteComment = !lead.hasWebsite
      ? `Notei que vocês ainda não possuem um site profissional, o que pode ser uma grande oportunidade de destacar a ${lead.name} da concorrência.`
      : ``;

    return `Olá, tudo bem?

Me chamo Vinícius e faço parte da ElevateX, uma agência especializada em resultados digitais.

Vi o perfil e as avaliações da ${lead.name} no Google e achei o trabalho muito bem avaliado pelos clientes.
${noSiteComment}

Acredito que podemos ajudar vocês com ${service}, trazendo mais visibilidade e clientes qualificados todos os meses.

Topam bater um rápido papo sobre como funcionaria? Podemos mandar uma proposta sem compromisso.

Fico no aguardo!`;
  }
}
