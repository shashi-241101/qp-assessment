import jwt from 'jsonwebtoken';
import User from '@/models/user.model';
import { User as UserType, JwtPayload } from '@/types';
import { logger } from '@/utils/logger';
import { config } from '@/config';

export const registerUser = async (userData: UserType): Promise<User> => {
  try {
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    logger.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    
    const token = generateToken(user);
    
    return { user, token };
  } catch (error) {
    logger.error('Error logging in user:', error);
    throw error;
  }
};

export const generateToken = (user: User): string => {
  const payload: JwtPayload = {
    id: user.id,
    username: user.username,
    role: user.role
  };
  
  return jwt.sign(
    payload,
    config.jwtSecret || 'fallback_secret',
    { expiresIn: '1d' }
  );
};