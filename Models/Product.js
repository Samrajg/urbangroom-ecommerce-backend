const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Please enter product description"]
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxLength: [8, "Price cannot exceed 8 characters"]
    },
    discountPrice: {
      type: Number
    },
    category: {
      type: String,
      required: [true, "Please enter product category"]
    },
    subCategory: {
      type: String
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      default: 0
    },
    images: [
      {
        type: String,
        required: true
      }
    ],
    ratings: {
      type: Number,
      default: 0
    },
    numOfReviews: {
      type: Number,
      default: 0
    },
    isSale: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);
