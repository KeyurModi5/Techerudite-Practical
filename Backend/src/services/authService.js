const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const User = require("../model/user");
require("dotenv").config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.registerUser = async (firstName, lastName, email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    verificationToken: verificationToken,
  });

  const verificationLink = `http://localhost:3000/verify/${verificationToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<p>Please click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  });

  return user;
};

exports.verifyEmail = async (token) => {
  console.log(token, "toke");
  const user = await User.findOne({ where: { verificationToken: token } });
  console.log(user, "user");
  if (!user) {
    throw new Error("Invalid verification token.");
  }
  user.verified = true;
  user.verificationToken = null;
  await user.save();
  return "Email verified successfully!";
};

exports.loginUser = async (email, password, role) => {
  const user = await User.findOne({ where: { email } });

  if (!user || user.role !== role) {
    throw new Error("Invalid credentials or not authorized.");
  }

  if (!user.verified) {
    throw new Error("Email not verified.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid credentials.");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, role: user.role };
};
