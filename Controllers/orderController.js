const Order = require("../Models/Order");
const Product = require("../Models/Product");
const Cart = require("../Models/Cart");

// Create new order => /api/orders
const newOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Check stock for each item before placing order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    }

    // Place the order
    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // Decrement product stocks
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    // Clear the user's cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

// Get single order details => /api/orders/:id
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "No order found with this ID" });
    }

    // Restrict access to order owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to view this order" });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch order details" });
  }
};

// Get logged-in user orders => /api/orders/myorders
const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch your orders" });
  }
};

module.exports = {
  newOrder,
  getSingleOrder,
  myOrders
};
