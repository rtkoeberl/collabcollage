// Authorize Discogs via Disconnect
const Disconnect = require('disconnect').Client;
const db = new Disconnect('CollabCollage/0.1', {
  consumerKey: process.env.REACT_APP_CONSUMER_KEY,
  consumerSecret: process.env.REACT_APP_CONSUMER_SECRET
}).database();
// console.log('Discogs connection established via Disconnect')

// Set 1-Request-per-Second limit with Bottleneck
const Bottleneck = require("bottleneck");
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000
});

// Discogs service functions: search for artist, get artist info, get artist's credits, get release info

const searchArtists = async (artist) => {
  try {
    return await limiter.schedule(() => db.search(artist, { type: 'artist' }))
  } catch(e) {
    throw new Error(e.message);
  }
}

const readArtist = async (artistId) => {
  try {
    return await limiter.schedule(() => db.getArtist(artistId));
  } catch(e) {
    throw new Error(e.message);
  }
}

// Return first page of artist's credits
const readArtistCredits = async (artistId, page) => {
  try {
    return await limiter.schedule(() => db.getArtistReleases(artistId, {sort: 'year', page: page, per_page: 100}))
  } catch(e) {
    throw new Error(e.message);
  }
}

// Retrieve details of singular release
const readRelease = async (releaseId) => {
  try {
    return await limiter.schedule(() => db.getRelease(releaseId));
  } catch(e) {
    throw new Error(e.message);
  }
}

module.exports = {
  searchArtists,
  readArtist,
  readArtistCredits,
  readRelease
}