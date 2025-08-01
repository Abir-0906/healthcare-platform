const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  filesize: Number,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Document', documentSchema);
