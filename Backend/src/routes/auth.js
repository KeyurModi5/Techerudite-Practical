const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// Customer Registration
router.post("/register/customer", authController.registerCustomer);

// Admin Registration
router.post("/register/admin", authController.registerAdmin);

// Verify Email
router.get("/verify/:token", authController.verifyEmail);

// Admin Login
router.post("/login/admin", authController.adminLogin);

module.exports = router;
