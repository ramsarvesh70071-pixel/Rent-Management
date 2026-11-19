const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 14, // So next will be 15, matching reference image #00015
  },
});

module.exports = mongoose.model('Counter', counterSchema);

