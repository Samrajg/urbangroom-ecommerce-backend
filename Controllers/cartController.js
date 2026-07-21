const Cart = require("../Models/Cart");

// Get user's cart => /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch cart" });
  }
};

// Sync/Update user's cart => /api/cart
const syncCart = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Items array is required" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({
        user: req.user.id,
        items
      });
    }

    // Populate and return updated cart
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to sync cart" });
  }
};

module.exports = {
  getCart,
  syncCart
};
