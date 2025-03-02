import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { connectToDatabase } from './infrastructure/database/connection';
import { errorHandler } from './interfaces/middlewares/errorHandler';
import { userRoutes } from './interfaces/routes/userRoutes';
import { storeRoutes } from './interfaces/routes/storeRoutes';
import { productRoutes } from './interfaces/routes/productRoutes';
import { voucherRoutes } from './interfaces/routes/voucherRoutes';
import { orderRoutes } from './interfaces/routes/orderRoutes';
import { voucherUsageRoutes } from './interfaces/routes/voucherUsageRoutes';
// Import other routes as they are implemented
// import { paymentRoutes } from './interfaces/routes/paymentRoutes';
// import { redemptionRoutes } from './interfaces/routes/redemptionRoutes';

// Load environment variables
config();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/voucher-usages', voucherUsageRoutes);
// Use other routes as they are implemented
// app.use('/api/payments', paymentRoutes);
// app.use('/api/redemptions', redemptionRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
