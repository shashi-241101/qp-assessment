import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/db.config';

interface GroceryItemAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  inventory: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GroceryItemCreationAttributes extends Optional<GroceryItemAttributes, 'id' | 'description'> {}

class GroceryItem extends Model<GroceryItemAttributes, GroceryItemCreationAttributes> implements GroceryItemAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public inventory!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GroceryItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    inventory: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'grocery_items',
  }
);

export default GroceryItem;