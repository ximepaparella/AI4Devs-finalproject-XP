import { Request, Response } from 'express';
import { User, IUser } from '../../domain/models/User';
import mongoose from 'mongoose';

/**
 * Get all users
 * @route GET /api/users
 * @access Private/Admin
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Private/Admin
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
      return;
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * Create new user
 * @route POST /api/users
 * @access Private/Admin
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
      return;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer'
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      
      res.status(400).json({
        success: false,
        error: messages
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * Update user
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
      return;
    }

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400).json({
          success: false,
          error: 'Email is already in use'
        });
        return;
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      
      res.status(400).json({
        success: false,
        error: messages
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * Delete user
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
}; 