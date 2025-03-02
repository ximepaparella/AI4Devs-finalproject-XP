import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for the Order document
 */
export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  voucherId: mongoose.Types.ObjectId;
  paymentDetails: {
    paymentId: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentEmail: string;
    amount: number;
    provider: 'mercadopago' | 'paypal' | 'stripe';
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order Schema
 */
const OrderSchema = new Schema<IOrder>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    customerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'Customer ID is required'] 
    },
    voucherId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Voucher', 
      required: [true, 'Voucher ID is required'] 
    },
    paymentDetails: {
      paymentId: { 
        type: String, 
        required: [true, 'Payment ID is required'] 
      },
      paymentStatus: { 
        type: String, 
        enum: {
          values: ['pending', 'completed', 'failed'],
          message: 'Payment status must be pending, completed, or failed'
        },
        required: [true, 'Payment status is required'] 
      },
      paymentEmail: { 
        type: String, 
        required: [true, 'Payment email is required'],
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email address'
        ]
      },
      amount: { 
        type: Number, 
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0']
      },
      provider: { 
        type: String, 
        enum: {
          values: ['mercadopago', 'paypal', 'stripe'],
          message: 'Provider must be mercadopago, paypal, or stripe'
        },
        required: [true, 'Provider is required'] 
      }
    }
  },
  {
    timestamps: true // Automatically manage createdAt and updatedAt
  }
);

// Indexes for optimized queries
OrderSchema.index({ customerId: 1, createdAt: -1 }); // Fetch orders by user, sorted by date
OrderSchema.index({ voucherId: 1 }); // Look up orders by voucher
OrderSchema.index({ 'paymentDetails.paymentStatus': 1 }); // Query by payment status

// Create and export the Order model
export const Order = mongoose.model<IOrder>('Order', OrderSchema); 