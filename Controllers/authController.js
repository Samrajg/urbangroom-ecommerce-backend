const User = require("../Models/User");

// Helper to send JWT Token in HTTP-Only Cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user
  });
};

// Register a user => /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar
    });

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

// Login user => /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    // Finding user and explicitly selecting the password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message || "Login failed" });
  }
};

// Logout user => /api/auth/logout
const logoutUser = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Logout failed" });
  }
};

// Get current logged-in user => /api/auth/me
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to retrieve profile" });
  }
};

// Update user profile/address => /api/auth/profile
const updateUserProfile = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      avatar: req.body.avatar
    };

    // If password is changed, hash it
    if (req.body.password) {
      newUserData.password = req.body.password; // Mongoose pre-save hook will hash this if we update through save()
    }

    // Address updates
    if (req.body.address) {
      newUserData.address = req.body.address;
    }

    // We use findById and save() so the password hook runs if password is updated
    const user = await User.findById(req.user.id);
    
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.address) user.address = req.body.address;
    if (req.body.password) user.password = req.body.password;
    if (req.body.skinProfile) user.skinProfile = req.body.skinProfile;

    await user.save();

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
};
