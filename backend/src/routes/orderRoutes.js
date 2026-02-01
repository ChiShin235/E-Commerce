import express from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
} from "../controllers/orderControllers.js";
import { requirePermission } from "../middleware/roleMiddleware.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route lấy orders của user hiện tại (cần xác thực)
router.get("/my", authenticateToken, getMyOrders);

router.get("/", requirePermission("manage_orders"), getAllOrders);
router.get("/:id", requirePermission("manage_orders"), getOrderById);
router.post("/", createOrder);
router.put("/:id", requirePermission("manage_orders"), updateOrder);
router.delete("/:id", requirePermission("manage_orders"), deleteOrder);

export default router;
