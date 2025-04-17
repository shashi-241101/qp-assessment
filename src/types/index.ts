export interface GroceryItem {
    id?: number;
    name: string;
    description?: string;
    price: number;
    inventory: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Order {
    id?: number;
    userId: number;
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface OrderItem {
    id?: number;
    orderId: number;
    groceryItemId: number;
    quantity: number;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface JwtPayload {
    id: number;
    username: string;
    role: string;
  }