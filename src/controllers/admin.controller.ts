import { Request, Response } from 'express';
import {
  addGroceryItem,
  getAllGroceryItems,
  getGroceryItemById,
  updateGroceryItem,
  deleteGroceryItem,
  updateInventory
} from '@/services/admin.service';
import { logger } from '@/utils/logger';

export const createGroceryItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price, inventory } = req.body;
    
    // Basic validation
    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and price'
      });
    }
    
    const newItem = await addGroceryItem({
      name,
      description: description || '',
      price: parseFloat(price),
      inventory: inventory || 0
    });
    
    res.status(201).json({
      success: true,
      message: 'Grocery item created successfully',
      data: newItem
    });
  } catch (error) {
    logger.error('Error creating grocery item:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating grocery item'
    });
  }
};

export const getGroceryItems = async (req: Request, res: Response) => {
  try {
    const items = await getAllGroceryItems();
    
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching grocery items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grocery items'
    });
  }
};

export const getGroceryItem = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    const item = await getGroceryItemById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    logger.error('Error fetching grocery item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grocery item'
    });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    const { name, description, price } = req.body;
    
    // Check if the item exists
    const item = await getGroceryItemById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }
    
    // Update only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    
    const [updatedRows, updatedItems] = await updateGroceryItem(id, updateData);
    
    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Grocery item updated successfully',
      data: updatedItems[0]
    });
  } catch (error) {
    logger.error('Error updating grocery item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating grocery item'
    });
  }
};

export const removeGroceryItem = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    const deletedRows = await deleteGroceryItem(id);
    
    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Grocery item deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting grocery item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting grocery item'
    });
  }
};

export const manageInventory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    const { quantity } = req.body;
    
    if (quantity === undefined || isNaN(parseInt(quantity, 10))) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity'
      });
    }
    
    const [updatedRows, updatedItems] = await updateInventory(id, parseInt(quantity, 10));
    
    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Grocery item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Inventory updated successfully',
      data: updatedItems[0]
    });
  } catch (error) {
    logger.error('Error updating inventory:', error);
    
    // Check for specific error message
    if (error instanceof Error && error.message === 'Cannot reduce inventory below zero') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reduce inventory below zero'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating inventory'
    });
  }
};