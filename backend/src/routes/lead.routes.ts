import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { verifyToken, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createLeadSchema,
  updateLeadSchema,
  queryLeadSchema,
} from '../validators/lead.validator';

const router = Router();

// Apply protection to all lead endpoints using verifyToken middleware
router.use(verifyToken);

router.post('/', validate(createLeadSchema), LeadController.create);
router.get('/', validate(queryLeadSchema), LeadController.list);
router.post('/export/csv', LeadController.exportCSV); // CSV export is POST but can accept body/query filters

router.get('/:id', LeadController.getById);
router.put('/:id', validate(updateLeadSchema), LeadController.update);
router.delete('/:id', requireRole(['admin']), LeadController.delete);

export default router;
