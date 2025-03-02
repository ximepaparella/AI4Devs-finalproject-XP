import mongoose, { Document, Schema } from 'mongoose';

export interface IVoucher extends Document {
  storeId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId | null;
  code: string;
  status: 'active' | 'redeemed' | 'expired';
  expirationDate: Date;
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const VoucherSchema = new Schema<IVoucher>(
  {
    storeId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Store',
      required: [true, 'Store ID is required']
    },
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product',
      required: [true, 'Product ID is required']
    },
    customerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      default: null
    },
    code: { 
      type: String, 
      required: [true, 'Voucher code is required'],
      unique: true,
      trim: true
    },
    status: { 
      type: String, 
      enum: ['active', 'redeemed', 'expired'],
      required: true,
      default: 'active'
    },
    expirationDate: { 
      type: Date, 
      required: [true, 'Expiration date is required']
    },
    qrCode: { 
      type: String, 
      required: [true, 'QR code is required']
    }
  },
  { timestamps: true }
);

// Indexes for optimized queries
VoucherSchema.index({ code: 1 }, { unique: true }); // Prevent duplicate voucher codes
VoucherSchema.index({ customerId: 1, status: 1 }); // Fetch vouchers for a user by status
VoucherSchema.index({ storeId: 1 }); // Fetch all vouchers for a store
VoucherSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 }); // Auto-remove expired vouchers

export const Voucher = mongoose.model<IVoucher>('Voucher', VoucherSchema); 