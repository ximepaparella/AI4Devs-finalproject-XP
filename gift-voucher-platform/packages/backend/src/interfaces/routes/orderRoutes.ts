import express from 'express';
import {
  getAllOrders,
  getOrderById,
  getOrdersByCustomerId,
  createOrder,
  updateOrder,
  deleteOrder
} from '../../application/controllers/orderController';

const router = express.Router();

// GET all orders
router.get('/', getAllOrders);

// GET orders by customer ID
router.get('/customer/:customerId', getOrdersByCustomerId);

// GET order by ID
router.get('/:id', getOrderById);

// POST create new order
router.post('/', createOrder);

// PUT update order
router.put('/:id', updateOrder);

// DELETE order
router.delete('/:id', deleteOrder);

export { router as orderRoutes }; 