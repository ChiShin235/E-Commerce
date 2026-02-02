import User from "../models/User.js";

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.userId).populate("roles");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const hasAdminRole =
      user.role === "admin" ||
      (user.roles || []).some((role) => role.name === "admin");
    if (!hasAdminRole) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in requireAdmin:", error);
    res.status(500).json({
      success: false,
      message: "Server error while checking admin role",
    });
  }
};

export const requireManager = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.userId).populate("roles");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const hasManagerRole =
      user.role === "manager" ||
      (user.roles || []).some((role) => role.name === "manager");
    if (!hasManagerRole) {
      return res.status(403).json({
        success: false,
        message: "Manager access required",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in requireManager:", error);
    res.status(500).json({
      success: false,
      message: "Server error while checking manager role",
    });
  }
};

export const requirePermission = (permissionKey) => async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.userId).populate({
      path: "roles",
      populate: { path: "permissions" },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const hasAdminRole =
      user.role === "admin" ||
      (user.roles || []).some((role) => role.name === "admin");
    if (hasAdminRole) {
      req.user = user;
      return next();
    }

    const permissionSet = new Set();
    (user.roles || []).forEach((role) => {
      (role.permissions || []).forEach((permission) => {
        if (permission?.key) {
          permissionSet.add(permission.key);
        }
      });
    });

    if (!permissionSet.has(permissionKey)) {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
      });
    }

    req.user = user;
    req.permissions = Array.from(permissionSet);
    next();
  } catch (error) {
    console.error("Error in requirePermission:", error);
    res.status(500).json({
      success: false,
      message: "Server error while checking permission",
    });
  }
};
