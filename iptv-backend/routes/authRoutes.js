console.log('✅ authRoutes loaded');

const express = require('express');
const router = express.Router();

const { getMe } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
