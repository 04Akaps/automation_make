import { Router } from 'express';
import { container } from '../../../di/container';
import { SubscriptionController } from '../controllers/SubscriptionController';

const router = Router();
const controller = container.resolve(SubscriptionController);

router.post('/create', controller.createSubscription);
router.get('/subscription-status/:email', controller.getSubscriptionStatus);
router.post('/cancel-subscription', controller.cancelSubscriptionByEmail);
router.post('/create-checkout-session', controller.createCheckoutSession);
router.get('/prices', controller.getPrices);

export default router;
