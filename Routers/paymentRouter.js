const express = require("express");
const router = express.Router();
const { processPayment, paymentWebhook } = require("../Controllers/paymentController");
const { isAuthenticatedUser } = require("../Middlewares/authMiddleware");

router.post("/payment/process", isAuthenticatedUser, processPayment);
router.post("/payment/webhook", paymentWebhook);

module.exports = router;
