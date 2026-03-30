const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  getMe,
  updateMe,
  getFavorites,
  addFavorite,
  removeFavorite,
} = require('../controllers/userController');


router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);


router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites', protect, removeFavorite);

module.exports = router;
