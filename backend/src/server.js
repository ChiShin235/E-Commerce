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

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174,http://localhost:3000,http://localhost:5001,http://127.0.0.1:5001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// CORS: allow configured origins for all routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware Ä‘á»ƒ parse JSON tá»« request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Request logging (debug)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// Routes
app.use("/api/users", authRoutes);
// Back-compat: allow /api/register and /api/login (and /api/me) to hit user routes
app.use("/api", authRoutes);
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


process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});// Káº¿t ná»‘i vá»›i MongoDB trÆ°á»›c khi khá»Ÿi Ä‘á»™ng server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`ðŸš€ Server báº¯t Ä‘áº§u trÃªn cá»•ng ${PORT}`);
    });
}).catch((error) => {
    console.error("âŒ KhÃ´ng thá»ƒ khá»Ÿi Ä‘á»™ng server:", error);
    process.exit(1);
});




