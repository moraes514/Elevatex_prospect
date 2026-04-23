import { Router, Request, Response } from 'express';
import { CollectorService } from './collector.service';

const router = Router();

router.post('/search', async (req: Request, res: Response) => {
  const { niche, region, limit = 20, filterBy = 'all' } = req.body;
  if (!niche || !region) {
    return res.status(400).json({ error: 'Niche and region are required' });
  }

  try {
    const leads = await CollectorService.searchLeads(niche, region, Number(limit), filterBy);
    res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    res.status(500).json({ error: 'Failed to run search' });
  }
});

export default router;
