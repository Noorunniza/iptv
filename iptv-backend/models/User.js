const mongoose = require('mongoose');


const favoriteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    folder: {
      type: String,
      required: true,
      trim: true,
      default: 'All Favorites', 
    },
  },
  { _id: false } 
);


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    favorites: {
      type: [favoriteSchema],
      default: [],
    },

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
