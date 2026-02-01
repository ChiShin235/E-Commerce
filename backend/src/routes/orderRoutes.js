import express from 'express';
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../controllers/orderControllers.js';
import { requirePermission } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', requirePermission('manage_orders'), getAllOrders);
router.get('/:id', requirePermission('manage_orders'), getOrderById);
router.post('/', createOrder);
router.put('/:id', requirePermission('manage_orders'), updateOrder);
router.delete('/:id', requirePermission('manage_orders'), deleteOrder);

export default router;

