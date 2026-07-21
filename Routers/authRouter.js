const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
} = require("../Controllers/authController");
const { isAuthenticatedUser } = require("../Middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/profile", isAuthenticatedUser, updateUserProfile);

module.exports = router;
