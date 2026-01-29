import express from "express";
import cors from "cors";
import productsRoutes from "./routes/productsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import aiRecommendationRoutes from "./routes/aiRecommendationRoutes.js";
import chatbotLogRoutes from "./routes/chatbotLogRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import cartItemRoutes from "./routes/cartItemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderItemRoutes from "./routes/orderItemRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import { requireAdmin } from "./middleware/roleMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express ();

// CORS: allow all origins for all routes
app.use(cors());
app.options("*", cors());

// Middleware Ä‘á»ƒ parse JSON tá»« request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", authenticateToken, requireAdmin, productsRoutes);
app.use("/api/categories", authenticateToken, requireAdmin, categoryRoutes);
app.use("/api/reviews", authenticateToken, requireAdmin, reviewRoutes);
app.use("/api/recommendations", authenticateToken, requireAdmin, aiRecommendationRoutes);
app.use("/api/chatbot-logs", authenticateToken, requireAdmin, chatbotLogRoutes);
app.use("/api/carts", authenticateToken, requireAdmin, cartRoutes);
app.use("/api/cart-items", authenticateToken, requireAdmin, cartItemRoutes);
app.use("/api/orders", authenticateToken, requireAdmin, orderRoutes);
app.use("/api/order-items", authenticateToken, requireAdmin, orderItemRoutes);
app.use("/api/payments", authenticateToken, requireAdmin, paymentRoutes);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware xá»­ lÃ½ lá»—i (pháº£i Ä‘áº·t sau táº¥t cáº£ routes)
app.use((err, req, res, next) => {
    console.error("âŒ Unhandled error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Lá»—i server khÃ´ng xÃ¡c Ä‘á»‹nh",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Route 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route khÃ´ng tá»“n táº¡i"
    });
});

// Káº¿t ná»‘i vá»›i MongoDB trÆ°á»›c khi khá»Ÿi Ä‘á»™ng server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`ðŸš€ Server báº¯t Ä‘áº§u trÃªn cá»•ng ${PORT}`);
    });
}).catch((error) => {
    console.error("âŒ KhÃ´ng thá»ƒ khá»Ÿi Ä‘á»™ng server:", error);
    process.exit(1);
});
