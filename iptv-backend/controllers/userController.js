const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.getMe = async (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
  });
};


exports.updateMe = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = name || user.name;
  user.email = email || user.email;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    name: user.name,
    email: user.email,
  });
};


exports.getFavorites = async (req, res) => {
  res.json(req.user.favorites || []);
};


exports.addFavorite = async (req, res) => {
  try {
    const { name, url, folder } = req.body;

    if (!name || !url) {
      return res.status(400).json({ message: 'Invalid channel data' });
    }


    const finalFolder = folder || 'All Favorites';

    const exists = req.user.favorites.some(
      f => f.url === url
    );

    if (exists) {
      return res.status(400).json({ message: 'Already favorited' });
    }

    req.user.favorites.push({
      name,
      url,
      folder: finalFolder, 
    });

    await req.user.save();

    res.json(req.user.favorites);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};


exports.removeFavorite = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL required' });
  }

  req.user.favorites = req.user.favorites.filter(
    f => f.url !== url
  );

  await req.user.save();

  res.json(req.user.favorites);
};
