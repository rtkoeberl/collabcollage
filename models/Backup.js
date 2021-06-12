const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BackupSchema = new Schema({
  artist: {
    type: String,
    required: true
  },
  artistId: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  releases: {
    type: [mongoose.Schema.Types.Mixed],
    required: true
  },
  items: {
    type: Number
  }
})

module.exports = Backup = mongoose.model('backup', BackupSchema);