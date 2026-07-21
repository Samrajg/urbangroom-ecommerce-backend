const express = require("express");
const router = express.Router();
const { getCart, syncCart } = require("../Controllers/cartController");
const { isAuthenticatedUser } = require("../Middlewares/authMiddleware");

router.get("/cart", isAuthenticatedUser, getCart);
router.post("/cart", isAuthenticatedUser, syncCart);

module.exports = router;
