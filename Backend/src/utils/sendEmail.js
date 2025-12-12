const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.sendOtp = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your OTP for AgroConnect",
      text: `Your verification OTP is: ${otp}`,
    });
    console.log("OTP email sent to:", to);
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    throw err;
  }
};

