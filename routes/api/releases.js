const express = require('express');
const router = express.Router();

// Discog model
const Release = require('../../models/Release');


// @route   GET api/releases/
// @desc    Get All Release Collections
// @access  Public
router.get('/', (req, res) => {
  Release.find()
    .then(releases => res.json(releases))
    .catch(err => res.status(400).json('Error: ' + err))
});

// @route   GET api/releases/:artistId
// @desc    Get Releases By Artist Id
// @access  Public
router.get('/:artistId', (req, res) => {
  Release.find({ artistId: req.params.artistId })
})

// @route   POST api/releases/add
router.post('/', (req, res) => {
  const newReleases = new Release({
    artist: req.body.artist,
    artistId: req.body.artistId,
    releases: req.body.releases,
    items:  req.body.items
  })

  newReleases.save().then(releases => res.json(releases))
})

// @route   POST api/releases/:id
// @route   DELETE api/releases/:id

module.exports = router;