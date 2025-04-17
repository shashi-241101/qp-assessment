import { Request, Response } from 'express';
import { registerUser, loginUser } from '@/services/auth.service';
import { logger } from '@/utils/logger';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email and password'
      });
    }
    
    const user = await registerUser({
      username,
      email,
      password,
      role: role || 'user'
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    
    // Check for duplicate email/username
    if (error instanceof Error && error.message.includes('duplicate')) {
      return res.status(400).json({
        success: false,
        message: 'Email or username already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    const { user, token } = await loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
};