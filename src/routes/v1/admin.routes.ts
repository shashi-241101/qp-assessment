import { Router } from 'express';
import {
  createGroceryItem,
  getGroceryItems,
  getGroceryItem,
  updateItem,
  removeGroceryItem,
  manageInventory
} from '@/controllers/admin.controller';
import { authenticate, authorizeAdmin } from '@/middlewares/auth.middleware';

const router = Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate, authorizeAdmin);

// Admin routes
router.post('/grocery', createGroceryItem);
router.get('/grocery', getGroceryItems);
router.get('/grocery/:id', getGroceryItem);
router.put('/grocery/:id', updateItem);
router.delete('/grocery/:id', removeGroceryItem);
router.patch('/grocery/:id/inventory', manageInventory);

export default router;