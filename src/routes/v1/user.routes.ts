import { Router } from 'express';
import {
  getAvailableGroceryItems,
  bookOrder,
  getOrders,
  getOrder
} from '@/controllers/user.controller';
import { authenticate, authorizeUser } from '@/middlewares/auth.middleware';

const router = Router();

// Public route for viewing available grocery items
router.get('/grocery', getAvailableGroceryItems);

// Protected routes
router.use(authenticate, authorizeUser);
router.post('/orders', bookOrder);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrder);

export default router;