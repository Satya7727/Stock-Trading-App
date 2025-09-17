const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
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

  balance: {
    type: Number,
    default: 100000,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {userSchema};

