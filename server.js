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

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/urbangroom';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
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
