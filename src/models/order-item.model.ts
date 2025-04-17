import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/db.config';
import Order from './order.model';
import GroceryItem from './grocery.model';

interface OrderItemAttributes {
  id: number;
  orderId: number;
  groceryItemId: number;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: number;
  public orderId!: number;
  public groceryItemId!: number;
  public quantity!: number;
  public price!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: 'id',
      },
    },
    groceryItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: GroceryItem,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'order_items',
  }
);

// Define associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(GroceryItem, { foreignKey: 'groceryItemId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
GroceryItem.hasMany(OrderItem, { foreignKey: 'groceryItemId' });

export default OrderItem;