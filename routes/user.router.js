const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/user.controllers");
const authMiddleware = require("../middleware/auth.middleware");


// Auth Routes
router.route("/register").post(register)
router.route("/login").post(authMiddleware, login)
router.route("/logout").post(authMiddleware, logout)

module.exports = router;