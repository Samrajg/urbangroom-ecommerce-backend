const express = require("express");
const router = express.Router();
const { newOrder, getSingleOrder, myOrders } = require("../Controllers/orderController");
const { isAuthenticatedUser } = require("../Middlewares/authMiddleware");

router.post("/orders", isAuthenticatedUser, newOrder);
router.get("/orders/myorders", isAuthenticatedUser, myOrders);
router.get("/orders/:id", isAuthenticatedUser, getSingleOrder);

module.exports = router;
