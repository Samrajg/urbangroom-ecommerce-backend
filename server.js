const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const seedProducts = async () => {
  try {
    const Product = require("./Models/Product");
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("Seeding initial products...");
      await Product.create([
        {
          name: 'Premium Beard Oil',
          description: 'Organic argan and jojoba oils blended for beard softness.',
          price: 499,
          category: 'Beard Care',
          subCategory: 'Beard Oil',
          stock: 50,
          images: ['https://images.unsplash.com/photo-1621607512214-68297480165e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
          ratings: 4.5,
          numOfReviews: 0,
          isSale: true
        },
        {
          name: 'Charcoal Face Wash',
          description: 'Activated charcoal pulls sebum and toxins out of pores.',
          price: 299,
          category: 'Face Care',
          subCategory: 'Face Wash',
          stock: 30,
          images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
          ratings: 4.0,
          numOfReviews: 0,
          isSale: false
        },
        {
          name: 'Hydrating Face Cream',
          description: '24-hour intense moisture lock with hyaluronic acid.',
          price: 399,
          category: 'Face Care',
          subCategory: 'Face Cream',
          stock: 45,
          images: ['https://images.unsplash.com/photo-1608248593842-8021f11c505f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
          ratings: 5.0,
          numOfReviews: 0,
          isSale: false
        },
        {
          name: 'Hair Styling Wax',
          description: 'Matte finish styling clay for long-lasting hold.',
          price: 349,
          category: 'Hair Styling',
          subCategory: 'Wax',
          stock: 60,
          images: ['https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
          ratings: 3.5,
          numOfReviews: 0,
          isSale: true
        },
        {
          name: 'Signature Cologne',
          description: 'Woody oud and fresh bergamot long-lasting premium scent.',
          price: 1299,
          category: 'Fragrances',
          subCategory: 'Cologne',
          stock: 15,
          images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
          ratings: 4.8,
          numOfReviews: 0,
          isSale: false
        }
      ]);
      console.log("Seeding completed successfully.");
    }
  } catch (err) {
    console.error("Error seeding products:", err);
  }
};

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/urbangroom';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    await seedProducts();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message || err);
    process.exit(1);
  }
};

// routes
app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register routers
app.use("/api/users", require("./Routers/UserRouter")); // legacy register route
app.use("/api/auth", require("./Routers/authRouter"));
app.use("/api", require("./Routers/productRouter"));
app.use("/api", require("./Routers/cartRouter"));
app.use("/api", require("./Routers/orderRouter"));
app.use("/api", require("./Routers/paymentRouter"));

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
