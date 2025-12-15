import { Router } from 'express';
import { container } from '../../../di/container';
import { NewsletterController } from '../controllers/NewsletterController';

const router = Router();
const controller = container.resolve(NewsletterController);

router.get('/', controller.getNewsletters);
router.get('/:id', controller.getNewsletterById);

export default router;
