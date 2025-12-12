const express = require("express");
const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const { sendOtp } = require("../utils/sendEmail");
const router = express.Router();

// Password validation regex: 8-30 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char (!@#$%^&*), no whitespace
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/;

const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (!PASSWORD_REGEX.test(password)) {
    return "Password must be 8-30 characters, contain at least one uppercase, one lowercase, one number, one special character (!@#$%^&*), and no whitespace";
  }
  return null;
};

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }
    
    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists. Please login instead." });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10);
    
    // Generate 6-digit OTP
    const otp = "" + Math.floor(100000 + Math.random() * 900000);
    
    // Delete any existing OTPs for this email
    await Otp.deleteMany({ email });
    
    // Create new OTP
    await Otp.create({ email, otp });
    
    // Send OTP email
    try {
      await sendOtp(email, otp);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      await Otp.deleteMany({ email });
      return res.status(500).json({ message: "Failed to send OTP email. Please check your email configuration." });
    }

    // Store credentials temporarily in-memory
    router.tempStorage = router.tempStorage || {};
    router.tempStorage[email] = {
      email,
      password: hashedPwd,
      firstName,
      lastName,
    };

    res.json({ message: "OTP sent to email. Please check your inbox." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration. Please try again." });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ message: "OTP must be a 6-digit number" });
    }
    
    // Find OTP record
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP. Please check your email or request a new OTP." });
    }

    // Retrieve data from temp storage
    const data = router.tempStorage && router.tempStorage[email];
    if (!data) {
      return res.status(400).json({
        message: "Registration session expired. Please sign up again.",
      });
    }

    // Check if user already exists (edge case)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Otp.deleteMany({ email });
      delete router.tempStorage[email];
      return res.status(400).json({ message: "User already registered. Please login instead." });
    }

    // Create user
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      verified: true,
    });
    
    // Clean up
    await Otp.deleteMany({ email });
    delete router.tempStorage[email];
    
    res.json({
      message: "User registered successfully",
      user: {
        email: user.email,
        verified: user.verified,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error during OTP verification. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ message: "No account found with this email." });
  if (!user.verified)
    return res
      .status(400)
      .json({
        message:
          "Account not verified. Please check your email for the OTP and complete registration.",
      });
  const validPwd = await bcrypt.compare(password, user.password);
  if (!validPwd)
    return res.status(400).json({ message: "Incorrect password." });
  const { password: _pwd, ...userData } = user.toObject();
  res.json({ success: true, user: userData });
});

module.exports = router;

