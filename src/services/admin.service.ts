import GroceryItem from '@/models/grocery.model';
import { GroceryItem as GroceryItemType } from '@/types';
import { logger } from '@/utils/logger';

export const addGroceryItem = async (itemData: GroceryItemType): Promise<GroceryItem> => {
  try {
    const newItem = await GroceryItem.create(itemData);
    return newItem;
  } catch (error) {
    logger.error('Error adding grocery item:', error);
    throw error;
  }
};

export const getAllGroceryItems = async (): Promise<GroceryItem[]> => {
  try {
    const items = await GroceryItem.findAll();
    return items;
  } catch (error) {
    logger.error('Error fetching grocery items:', error);
    throw error;
  }
};

export const getGroceryItemById = async (id: number): Promise<GroceryItem | null> => {
  try {
    const item = await GroceryItem.findByPk(id);
    return item;
  } catch (error) {
    logger.error(`Error fetching grocery item with id ${id}:`, error);
    throw error;
  }
};

export const updateGroceryItem = async (
  id: number,
  updateData: Partial<GroceryItemType>
): Promise<[number, GroceryItem[]]> => {
  try {
    const [updatedRows, updatedItems] = await GroceryItem.update(updateData, {
      where: { id },
      returning: true,
    });
    return [updatedRows, updatedItems];
  } catch (error) {
    logger.error(`Error updating grocery item with id ${id}:`, error);
    throw error;
  }
};

export const deleteGroceryItem = async (id: number): Promise<number> => {
  try {
    const deletedRows = await GroceryItem.destroy({
      where: { id },
    });
    return deletedRows;
  } catch (error) {
    logger.error(`Error deleting grocery item with id ${id}:`, error);
    throw error;
  }
};

export const updateInventory = async (
  id: number,
  quantity: number
): Promise<[number, GroceryItem[]]> => {
  try {
    const item = await GroceryItem.findByPk(id);
    
    if (!item) {
      throw new Error(`Grocery item with id ${id} not found`);
    }
    
    const newInventory = item.inventory + quantity;
    
    if (newInventory < 0) {
      throw new Error('Cannot reduce inventory below zero');
    }
    
    const [updatedRows, updatedItems] = await GroceryItem.update(
      { inventory: newInventory },
      {
        where: { id },
        returning: true,
      }
    );
    
    return [updatedRows, updatedItems];
  } catch (error) {
    logger.error(`Error updating inventory for item with id ${id}:`, error);
    throw error;
  }
};