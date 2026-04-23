import { prisma } from '../../lib/prisma';
import { ScorerService } from '../scorer/scorer.service';
import { OfferEngine } from '../offer/offer.service';
import { MessageEngine } from '../message/message.service';

export class CollectorService {
  static async searchLeads(niche: string, region: string, limit: number = 20, filterBy: string = 'all') {
    let collectedLeads: any[] = [];
    const apiKey = process.env.SERPER_API_KEY || process.env.SERPAPI_KEY;

    if (!apiKey) {
      console.log('Usando mock de leads - SERPER_API_KEY não configurada no .env.');
      collectedLeads = this.getMockLeads(niche, region);
    } else {
      let page = 1;
      const maxPages = 5;

      while (collectedLeads.length < limit && page <= maxPages) {
        console.log(`Buscando Serper.dev página ${page}...`);
        const pageData = await this.fetchFromSerpApi(niche, region, apiKey, page);
        if (pageData.length === 0) break;

        let filtered = pageData;
        if (filterBy === 'no_website') {
          filtered = filtered.filter((l: any) => l.hasWebsite === false);
        }

        collectedLeads = [...collectedLeads, ...filtered];
        page++;
      }
    }

    collectedLeads = collectedLeads.slice(0, limit);

    const transientLeads = [];

    for (const data of collectedLeads) {
      // Tudo feito em memória agora!
      const lead: any = {
        id: `T_${Math.random().toString(36).substring(7)}`,
        ...data,
      };

      const scoreData = ScorerService.calculateScore(lead);
      lead.score = scoreData;

      const recData = OfferEngine.recommend(lead);
      lead.recommendation = { recommendedService: recData.service, confidence: recData.confidence, reasoning: recData.reasoning };

      const messageContent = MessageEngine.generateMessage(lead, recData.service);
      lead.messages = [{ content: messageContent, tone: 'formal' }];
      
      lead.statuses = [{ status: 'Novo Lead (Prospecção)', updatedBy: 'System' }];

      transientLeads.push(lead);
    }

    return transientLeads;
  }

  static async fetchFromSerpApi(niche: string, region: string, apiKey: string, page: number = 1) {
    const query = `${niche} em ${region}`;
    // Usando SerpAPI.com engine: google_maps
    const url = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&google_domain=google.com.br&gl=br&hl=pt-br&api_key=${apiKey}`;
    
    console.log(`Buscando SerpAPI.com: ${query}...`);
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na SerpAPI:', errorText);
      return this.getMockLeads(niche, region);
    }

    const data = await response.json() as any;
    const places = data.local_results || [];

    return places.map((place: any) => ({
      name: place.title || 'Sem nome',
      category: niche,
      city: region,
      state: 'BR',
      address: place.address || null,
      phone: place.phone || null,
      website: place.website || null,
      mapsUrl: place.gps_coordinates 
        ? `https://www.google.com/maps/search/?api=1&query=${place.gps_coordinates.latitude},${place.gps_coordinates.longitude}` 
        : (place.link || null),
      placeId: place.place_id || `serp_${Math.random()}`,
      rating: place.rating || null,
      reviewsCount: place.reviews || 0,
      hasWebsite: !!place.website,
      source: 'serpapi.com',
      imageUrl: place.thumbnail || null,
      latitude: place.gps_coordinates?.latitude || null,
      longitude: place.gps_coordinates?.longitude || null,
    }));
  }

  static getMockLeads(niche: string, region: string) {
    return [
      {
        name: `Barbearia do João - ${region}`,
        category: niche,
        city: region,
        state: 'SP',
        address: 'Rua das Flores, 123',
        phone: '11999999999',
        website: null,
        mapsUrl: 'https://maps.google.com/?cid=123',
        placeId: `mock_${Math.random()}`,
        rating: 4.8,
        reviewsCount: 120,
        hasWebsite: false,
        source: 'demo'
      },
      {
        name: `Studio beleza e arte`,
        category: niche,
        city: region,
        state: 'SP',
        address: 'Av Principal, 456',
        phone: '11988888888',
        website: 'https://studiobeleza.com.br',
        mapsUrl: 'https://maps.google.com/?cid=456',
        placeId: `mock_${Math.random()}`,
        rating: 3.5,
        reviewsCount: 15,
        hasWebsite: true,
        source: 'demo'
      }
    ]
  }
}
