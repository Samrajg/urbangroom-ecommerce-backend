const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// Check if user is authenticated or not
const isAuthenticatedUser = async (req, res, next) => {
  try {
    let token;

    // Read token from cookie or Auth header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Login first to access this resource" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: "User not found or deleted" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired authorization token" });
  }
};

// Handling user roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    next();
  };
};

module.exports = {
  isAuthenticatedUser,
  authorizeRoles
};
