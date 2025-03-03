import { Request, Response } from 'express';
import { Voucher, IVoucher } from '../../domain/models/Voucher';
import { Store } from '../../domain/models/Store';
import { Product } from '../../domain/models/Product';
import { User } from '../../domain/models/User';
import mongoose from 'mongoose';
import crypto from 'crypto';
import QRCode from 'qrcode';

/**
 * Generate a unique voucher code
 * @returns {string} Unique voucher code
 */
const generateVoucherCode = (): string => {
  // Generate a random string of 8 characters
  const randomString = crypto.randomBytes(4).toString('hex').toUpperCase();
  // Add a timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
  // Combine and format with dashes for readability
  return `${randomString.slice(0, 4)}-${randomString.slice(4)}-${timestamp}`;
};

/**
 * Generate QR code for a voucher
 * @param {string} voucherCode - The voucher code
 * @returns {Promise<string>} Base64 encoded QR code image
 */
const generateQRCode = async (voucherCode: string): Promise<string> => {
  try {
    // Generate QR code with the full redemption URL
    const redemptionUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/vouchers/redeem/${voucherCode}`;
    return await QRCode.toDataURL(redemptionUrl);
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Get all vouchers
 * @route GET /api/vouchers
 * @access Private/Admin
 */
export const getAllVouchers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId, productId, customerId, status, sort, limit = 10, page = 1 } = req.query;
    const queryObject: any = {};
    
    // Apply filters if provided
    if (storeId) {
      queryObject.storeId = storeId;
    }
    
    if (productId) {
      queryObject.productId = productId;
    }
    
    if (customerId) {
      queryObject.customerId = customerId;
    }
    
    if (status) {
      queryObject.status = status;
    }

    let query = Voucher.find(queryObject);

    // Sort vouchers
    if (sort) {
      const sortBy = (sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    query = query.skip(skip).limit(Number(limit));

    const vouchers = await query;
    
    res.status(200).json({
      success: true,
      count: vouchers.length,
      data: vouchers
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
 * Get voucher by ID
 * @route GET /api/vouchers/:id
 * @access Private
 */
export const getVoucherById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid voucher ID format'
      });
      return;
    }

    const voucher = await Voucher.findById(id);

    if (!voucher) {
      res.status(404).json({
        success: false,
        error: 'Voucher not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: voucher
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
 * Get voucher by code
 * @route GET /api/vouchers/code/:code
 * @access Private
 */
export const getVoucherByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      res.status(404).json({
        success: false,
        error: 'Voucher not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: voucher
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
 * Get vouchers by store ID
 * @route GET /api/vouchers/store/:storeId
 * @access Private/StoreManager
 */
export const getVouchersByStoreId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId } = req.params;
    const { status, sort, limit = 10, page = 1 } = req.query;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid store ID format'
      });
      return;
    }

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      res.status(404).json({
        success: false,
        error: 'Store not found'
      });
      return;
    }

    // Build query
    const queryObject: any = { storeId };
    
    if (status) {
      queryObject.status = status;
    }

    let query = Voucher.find(queryObject);

    // Sort vouchers
    if (sort) {
      const sortBy = (sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    query = query.skip(skip).limit(Number(limit));

    const vouchers = await query;
    
    res.status(200).json({
      success: true,
      count: vouchers.length,
      data: vouchers
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
 * Get vouchers by customer ID
 * @route GET /api/vouchers/customer/:customerId
 * @access Private
 */
export const getVouchersByCustomerId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const { status, sort, limit = 10, page = 1 } = req.query;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid customer ID format'
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(customerId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }

    // Build query
    const queryObject: any = { customerId };
    
    if (status) {
      queryObject.status = status;
    }

    let query = Voucher.find(queryObject);

    // Sort vouchers
    if (sort) {
      const sortBy = (sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    query = query.skip(skip).limit(Number(limit));

    const vouchers = await query;
    
    res.status(200).json({
      success: true,
      count: vouchers.length,
      data: vouchers
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
 * Create new voucher
 * @route POST /api/vouchers
 * @access Private/StoreManager
 */
export const createVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId, productId, customerId, expirationDate, status } = req.body;

    // Validate if the storeId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid store ID format'
      });
      return;
    }

    // Validate if the productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
      return;
    }

    // Validate customerId if provided
    if (customerId && !mongoose.Types.ObjectId.isValid(customerId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid customer ID format'
      });
      return;
    }

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      res.status(404).json({
        success: false,
        error: 'Store not found'
      });
      return;
    }

    // Check if product exists and belongs to the store
    const product = await Product.findOne({ _id: productId, storeId });
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found or does not belong to the specified store'
      });
      return;
    }

    // Check if customer exists if customerId is provided
    if (customerId) {
      const customer = await User.findById(customerId);
      if (!customer) {
        res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
        return;
      }
    }

    // Generate voucher code
    const code = generateVoucherCode();
    
    // Generate QR code
    const qrCode = await generateQRCode(code);

    // Create new voucher
    const voucher = await Voucher.create({
      storeId,
      productId,
      customerId: customerId || null,
      code,
      status: status || 'active',
      expirationDate,
      qrCode
    });

    res.status(201).json({
      success: true,
      data: voucher
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

    // Handle duplicate key error (e.g., duplicate voucher code)
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: 'Duplicate voucher code. Please try again.'
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
 * Update voucher
 * @route PUT /api/vouchers/:id
 * @access Private/StoreManager
 */
export const updateVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { customerId, status, expirationDate } = req.body;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid voucher ID format'
      });
      return;
    }

    // Check if voucher exists
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      res.status(404).json({
        success: false,
        error: 'Voucher not found'
      });
      return;
    }

    // Validate customerId if provided
    if (customerId && !mongoose.Types.ObjectId.isValid(customerId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid customer ID format'
      });
      return;
    }

    // Check if customer exists if customerId is provided
    if (customerId) {
      const customer = await User.findById(customerId);
      if (!customer) {
        res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
        return;
      }
    }

    // Update voucher
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      { customerId, status, expirationDate },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedVoucher
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
 * Delete voucher
 * @route DELETE /api/vouchers/:id
 * @access Private/StoreManager
 */
export const deleteVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid voucher ID format'
      });
      return;
    }

    // Check if voucher exists
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      res.status(404).json({
        success: false,
        error: 'Voucher not found'
      });
      return;
    }

    // Delete voucher
    await Voucher.findByIdAndDelete(id);

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

/**
 * Redeem voucher
 * @route PUT /api/vouchers/:code/redeem
 * @access Private
 */
export const redeemVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    // Find voucher by code
    const voucher = await Voucher.findOne({ code });
    
    if (!voucher) {
      res.status(404).json({
        success: false,
        error: 'Voucher not found'
      });
      return;
    }

    // Check if voucher is already redeemed
    if (voucher.status === 'redeemed') {
      res.status(400).json({
        success: false,
        error: 'Voucher has already been redeemed'
      });
      return;
    }

    // Check if voucher is expired
    if (voucher.status === 'expired' || new Date(voucher.expirationDate) < new Date()) {
      res.status(400).json({
        success: false,
        error: 'Voucher has expired'
      });
      return;
    }

    // Update voucher status to redeemed
    voucher.status = 'redeemed';
    await voucher.save();

    res.status(200).json({
      success: true,
      data: voucher,
      message: 'Voucher successfully redeemed'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
}; 