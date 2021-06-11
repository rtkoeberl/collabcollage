const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ReleaseSchema = new Schema({
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

module.exports = Release = mongoose.model('release', ReleaseSchema);