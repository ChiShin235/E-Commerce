import User from "../models/User.js";

export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in requireAdmin:", error);
        res.status(500).json({
            success: false,
            message: "Server error while checking admin role"
        });
    }
};
