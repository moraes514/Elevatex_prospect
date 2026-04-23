import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { MessageEngine } from '../message/message.service';
import { OfferEngine } from '../offer/offer.service';

export class LeadController {
  static async clearAll(req: Request, res: Response) {
    try {
      await prisma.lead.deleteMany({});
      res.json({ success: true, message: 'Todos os leads limpos.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear leads' });
    }
  }

  static async createFromTransient(req: Request, res: Response) {
    try {
      const data = req.body;
      const lead = await prisma.lead.upsert({
        where: { placeId: data.placeId },
        update: {},
        create: {
          name: data.name,
          category: data.category,
          city: data.city,
          state: data.state,
          address: data.address,
          phone: data.phone,
          website: data.website,
          mapsUrl: data.mapsUrl,
          placeId: data.placeId,
          rating: data.rating,
          reviewsCount: data.reviewsCount,
          hasWebsite: data.hasWebsite,
          source: data.source,
          score: data.score ? {
            create: { score: data.score.score, classification: data.score.classification, scoreReason: data.score.scoreReason }
          } : undefined,
          recommendation: data.recommendation ? {
            create: { recommendedService: data.recommendation.recommendedService, confidence: data.recommendation.confidence, reasoning: data.recommendation.reasoning }
          } : undefined,
          messages: data.messages && data.messages.length > 0 ? {
            create: { content: data.messages[0].content, tone: data.messages[0].tone }
          } : undefined,
          statuses: data.statuses && data.statuses.length > 0 ? {
            create: { status: data.statuses[0].status, updatedBy: data.statuses[0].updatedBy }
          } : undefined
        }
      });
      res.json(lead);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save transient lead' });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const leads = await prisma.lead.findMany({
        include: {
          score: true,
          recommendation: true,
          statuses: { orderBy: { updatedAt: 'desc' }, take: 1 }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
          score: true,
          recommendation: true,
          messages: { orderBy: { generatedAt: 'desc' } },
          statuses: { orderBy: { updatedAt: 'desc' } },
          notes: { orderBy: { createdAt: 'desc' } }
        }
      });
      if (!lead) return res.status(404).json({ error: 'Lead not found' });
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch lead' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, updatedBy } = req.body;
    try {
      const leadStatus = await prisma.leadStatus.create({
        data: {
          leadId: id,
          status,
          updatedBy: updatedBy || 'System'
        }
      });
      res.json(leadStatus);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  }

  static async addNote(req: Request, res: Response) {
    const { id } = req.params;
    const { note } = req.body;
    try {
      const leadNote = await prisma.leadNote.create({
        data: {
          leadId: id,
          note
        }
      });
      res.json(leadNote);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add note' });
    }
  }

  static async generateMessage(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: { recommendation: true }
      });
      if (!lead) return res.status(404).json({ error: 'Lead not found' });

      let service = lead.recommendation?.recommendedService;
      if (!service) {
         const rec = OfferEngine.recommend(lead);
         service = rec.service;
      }

      const content = MessageEngine.generateMessage(lead, service);

      const message = await prisma.messageDraft.create({
        data: {
          leadId: id,
          content,
          tone: 'formal'
        }
      });
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate message' });
    }
  }
}
