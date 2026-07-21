const express = require("express");
const router = express.Router();
const {
  getProducts,
  getSingleProduct,
  addProductReview,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../Controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/authMiddleware");

// Public routes
router.get("/products", getProducts);
router.get("/products/:id", getSingleProduct);

// Auth routes
router.post("/products/:id/review", isAuthenticatedUser, addProductReview);

// Admin routes
router.post("/admin/products", isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.put("/admin/products/:id", isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router.delete("/admin/products/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;
