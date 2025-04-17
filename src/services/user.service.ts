import { Transaction } from 'sequelize';
import GroceryItem from '@/models/grocery.model';
import Order from '@/models/order.model';
import OrderItem from '@/models/order-item.model';
import sequelize from '@/config/db.config';
import { Op } from 'sequelize';
import { logger } from '@/utils/logger';

export const getAllAvailableGroceryItems = async (): Promise<GroceryItem[]> => {
  try {
    const items = await GroceryItem.findAll({
      where: {
        inventory: {
          [Op.gt]: 0
        }
      }
    });
    return items;
  } catch (error) {
    logger.error('Error fetching available grocery items:', error);
    throw error;
  }
};

interface OrderItemRequest {
  groceryItemId: number;
  quantity: number;
}

export const createOrder = async (
  userId: number,
  orderItems: OrderItemRequest[]
): Promise<Order> => {
  const t: Transaction = await sequelize.transaction();
  
  try {

    for (const item of orderItems) {
      const groceryItem = await GroceryItem.findByPk(item.groceryItemId, { transaction: t });
      
      if (!groceryItem) {
        throw new Error(`Grocery item with id ${item.groceryItemId} not found`);
      }
      
      if (groceryItem.inventory < item.quantity) {
        throw new Error(`Not enough inventory for ${groceryItem.name}. Available: ${groceryItem.inventory}, Requested: ${item.quantity}`);
      }
    }
    
    // Calculate total amount and create the order
    let totalAmount = 0;
    
    for (const item of orderItems) {
      const groceryItem = await GroceryItem.findByPk(item.groceryItemId, { transaction: t });
      if (groceryItem) {
        totalAmount += parseFloat(groceryItem.price.toString()) * item.quantity;
      }
    }
    
    const order = await Order.create(
      {
        userId,
        totalAmount,
        status: 'pending'
      },
      { transaction: t }
    );
    
    // Create order items and update inventory
    for (const item of orderItems) {
      const groceryItem = await GroceryItem.findByPk(item.groceryItemId, { transaction: t });
      
      if (groceryItem) {
        await OrderItem.create(
          {
            orderId: order.id,
            groceryItemId: item.groceryItemId,
            quantity: item.quantity,
            price: groceryItem.price
          },
          { transaction: t }
        );
        
        // Update inventory
        await groceryItem.update(
          {
            inventory: groceryItem.inventory - item.quantity
          },
          { transaction: t }
        );
      }
    }
    
    // Commit the transaction
    await t.commit();
    
    // Return the created order
    return order;
  } catch (error) {
    // Rollback the transaction in case of error
    await t.rollback();
    logger.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: number): Promise<Order[]> => {
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [GroceryItem]
        }
      ]
    });
    
    return orders;
  } catch (error) {
    logger.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
};

export const getOrderById = async (
  orderId: number,
  userId: number
): Promise<Order | null> => {
  try {
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId
      },
      include: [
        {
          model: OrderItem,
          include: [GroceryItem]
        }
      ]
    });
    
    return order;
  } catch (error) {
    logger.error(`Error fetching order ${orderId} for user ${userId}:`, error);
    throw error;
  }
};