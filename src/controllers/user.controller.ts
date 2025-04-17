import { Request, Response } from 'express';
import {
  getAllAvailableGroceryItems,
  createOrder,
  getUserOrders,
  getOrderById
} from '@/services/user.service';
import { logger } from '@/utils/logger';

export const getAvailableGroceryItems = async (_req: Request, res: Response) => {
  try {
    const items = await getAllAvailableGroceryItems();
    
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching available grocery items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available grocery items'
    });
  }
};

export const bookOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const { items } = req.body;
    
    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid array of items'
      });
    }
    
    // Validate each item
    for (const item of items) {
      if (!item.groceryItemId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid groceryItemId and quantity'
        });
      }
    }
    
    const order = await createOrder(req.user.id, items);
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    logger.error('Error booking order:', error);
    
    // Check for specific error messages
    if (error instanceof Error && (
      error.message.includes('not found') ||
      error.message.includes('Not enough inventory')
    )) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error placing order'
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const orders = await getUserOrders(req.user.id);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    logger.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const orderId = parseInt(req.params.id, 10);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }
    
    const order = await getOrderById(orderId, req.user.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details'
    });
  }
};