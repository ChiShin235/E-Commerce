import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productControllers.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", authenticateToken, requireAdmin, createProduct);

router.put("/:id", authenticateToken, requireAdmin, updateProduct);

router.delete("/:id", authenticateToken, requireAdmin, deleteProduct);

export default router;