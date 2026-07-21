const Product = require("../Models/Product");
const Review = require("../Models/Review");

// Get all products with filters, search, sort, and pagination => /api/products
const getProducts = async (req, res) => {
  try {
    const { search, category, subCategory, sort, minPrice, maxPrice, page, limit } = req.query;

    const query = {};

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Filter by Sub-category
    if (subCategory) {
      query.subCategory = subCategory;
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortQuery = {};
    if (sort) {
      if (sort === "priceAsc") sortQuery.price = 1;
      else if (sort === "priceDesc") sortQuery.price = -1;
      else if (sort === "ratings") sortQuery.ratings = -1;
      else if (sort === "newest") sortQuery.createdAt = -1;
    } else {
      sortQuery.createdAt = -1; // Default
    }

    // Pagination
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const skipNum = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      products,
      page: pageNum,
      pages: Math.ceil(totalProducts / limitNum)
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch products" });
  }
};

// Get single product details => /api/products/:id
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch reviews for this product
    const reviews = await Review.find({ product: product._id }).populate("user", "name avatar");

    res.status(200).json({
      success: true,
      product,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch product details" });
  }
};

// Create or update review => /api/products/:id/review
const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find if user already reviewed the product
    let review = await Review.findOne({ user: req.user.id, product: productId });

    if (review) {
      // Update existing review
      review.rating = Number(rating);
      review.comment = comment;
      review.userName = req.user.name;
      await review.save();
    } else {
      // Create new review
      review = await Review.create({
        user: req.user.id,
        userName: req.user.name,
        product: productId,
        rating: Number(rating),
        comment
      });
    }

    // Re-calculate average ratings
    const reviews = await Review.find({ product: productId });
    const numOfReviews = reviews.length;
    const ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

    product.ratings = ratings;
    product.numOfReviews = numOfReviews;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to add review" });
  }
};

// Admin: Create product => /api/admin/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, subCategory, stock, images, isSale } = req.body;

    if (!name || !description || !price || !category || !images || images.length === 0) {
      return res.status(400).json({ message: "Name, description, price, category, and at least one image are required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      category,
      subCategory,
      stock,
      images,
      isSale
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create product" });
  }
};

// Admin: Update product => /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update product" });
  }
};

// Admin: Delete product => /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete all reviews associated with this product
    await Review.deleteMany({ product: product._id });
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete product" });
  }
};

module.exports = {
  getProducts,
  getSingleProduct,
  addProductReview,
  createProduct,
  updateProduct,
  deleteProduct
};
