const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BackupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true,
    unique: true
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