const { response } = require('express');
const { discogsService } = require('../services');

const {
  searchArtists,
  readArtist,
  readArtistCredits,
  readRelease
} = discogsService;

// Return results of Discogs search for artist name
const search = async (req, res) => {
  try {
    const { artist } = req.params;
    const artistResults = await searchArtists(artist);
    console.log('Search results retrieved');
    res.json(artistResults);
  } catch {
    err => res.status(400).json('Error: ' + err);
  }
};

// Return artist info from Discogs
const getArtist = async (req, res) => {
  try {
    const { artistId }  = req.params;
    const artistInfo = await readArtist(artistId);
    console.log(`Artist info for ${artistInfo.name} retrieved`);
    res.json(artistInfo); 
  } catch {
    err => res.status(400).json('Error: ' + err)
  }
};

// Check local and db storage for discography and otherwise return first page of results from Discogs
const getArtistReleases = async (req, res) => {
  try {
    const { artistId }  = req.params;
    const results = await readArtistCredits(artistId)  
    console.log(`First page of artist #${artistId}'s credits retrieved`)
    res.json(results);
  } catch {
    err => res.status(400).json('Error: ' + err)
  }
}

// Return specific page of Discogs discography
const getArtistReleasePage = async (req, res) => {
  try {
    const { artistId, page }  = req.params;
    res.json(await readArtistCredits(artistId, page))
  } catch {
    err => res.status(400).json('Error: ' + err)
  }
}

// Get release
const getRelease = async (req, res) => {
  try {
    const { releaseId }  = req.params;
    const releaseInfo = await readRelease(releaseId)
    res.json(releaseInfo); 
  } catch {
    err => res.status(400).json('Error: ' + err)
  }
};

module.exports = {
  search,
  getArtist,
  getArtistReleases,
  getArtistReleasePage,
  getRelease
}