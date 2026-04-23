import { Router } from 'express';
import { LeadController } from './lead.controller';

const router = Router();

router.get('/', LeadController.list);
router.delete('/clear', LeadController.clearAll);
router.post('/', LeadController.createFromTransient);
router.get('/:id', LeadController.getById);
router.patch('/:id/status', LeadController.updateStatus);
router.post('/:id/notes', LeadController.addNote);
router.post('/:id/message', LeadController.generateMessage);

export default router;
