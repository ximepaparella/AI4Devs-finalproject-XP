import { Request, Response } from 'express';
import { Order, IOrder } from '../../domain/models/Order';
import { User } from '../../domain/models/User';
import { Voucher } from '../../domain/models/Voucher';
import mongoose from 'mongoose';

/**
 * Get all orders
 * @route GET /api/orders
 * @access Private/Admin
 */
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, voucherId, paymentStatus, sort, limit = 10, page = 1 } = req.query;
    const queryObject: any = {};
    
    // Apply filters if provided
    if (customerId) {
      queryObject.customerId = customerId;
    }
    
    if (voucherId) {
      queryObject.voucherId = voucherId;
    }
    
    if (paymentStatus) {
      queryObject['paymentDetails.paymentStatus'] = paymentStatus;
    }

    let query = Order.find(queryObject);

    // Sort orders
    if (sort) {
      const sortBy = (sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    query = query.skip(skip).limit(Number(limit));

    const orders = await query;
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
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
 * Get order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
      return;
    }

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order
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
 * Get orders by customer ID
 * @route GET /api/orders/customer/:customerId
 * @access Private
 */
export const getOrdersByCustomerId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const { sort, limit = 10, page = 1 } = req.query;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid customer ID format'
      });
      return;
    }

    // Check if customer exists
    const customer = await User.findById(customerId);
    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }

    // Build query
    let query = Order.find({ customerId }).sort({ createdAt: -1 });

    // Sort orders
    if (sort) {
      const sortBy = (sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    query = query.skip(skip).limit(Number(limit));

    const orders = await query;
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
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
 * Create order
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, voucherId, paymentDetails } = req.body;

    // Validate if the IDs are valid MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(voucherId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
      return;
    }

    // Check if customer exists
    const customer = await User.findById(customerId);
    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }

    // Check if voucher exists
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      res.status(404).json({
        success: false,
        error: 'Voucher not found'
      });
      return;
    }

    // Check if voucher is already purchased (has an order)
    const existingOrder = await Order.findOne({ voucherId });
    if (existingOrder) {
      res.status(400).json({
        success: false,
        error: 'Voucher has already been purchased'
      });
      return;
    }

    // Create new order
    const order = await Order.create({
      customerId,
      voucherId,
      paymentDetails
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }
};

/**
 * Update order
 * @route PUT /api/orders/:id
 * @access Private/Admin
 */
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentDetails } = req.body;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
      return;
    }

    // Check if order exists
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    // Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paymentDetails },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }
};

/**
 * Delete order
 * @route DELETE /api/orders/:id
 * @access Private/Admin
 */
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
      return;
    }

    // Check if order exists
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    // Delete order
    await Order.findByIdAndDelete(id);

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