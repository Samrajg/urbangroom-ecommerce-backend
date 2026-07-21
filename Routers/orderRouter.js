const express = require("express");
const router = express.Router();
const { newOrder, getSingleOrder, myOrders, allOrders } = require("../Controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/authMiddleware");

router.post("/orders", isAuthenticatedUser, newOrder);
router.get("/orders/myorders", isAuthenticatedUser, myOrders);
router.get("/orders/:id", isAuthenticatedUser, getSingleOrder);

// Admin routes
router.get("/admin/orders", isAuthenticatedUser, authorizeRoles("admin"), allOrders);

module.exports = router;
