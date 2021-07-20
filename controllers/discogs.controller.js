const { response } = require('express');
const { discogsService, backupService } = require('../services');

const {
  searchArtists,
  readArtist,
  readArtistCredits,
  compileArtistCredits,
  readRelease
} = discogsService;

// Return results of Discogs search for artist name
const search = (req, res) => {
  const { artist } = req.params;
  searchArtists(artist)
    .then(results => {
      // .then(data => {
      //   return data.results.foreach(result => {
      //     (I want result.id and result.title and maybe result.cover_image)
      //    })
      //  });
      console.log('Search results retrieved')
      res.json(results);
    })
    .catch(err => res.status(400).json('Error: ' + err))
};

// Return artist info from Discogs
const getArtist = async (req, res) => {
  try {
    const { artistId }  = req.params;
    const artistInfo = await readArtist(artistId)
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
    // if (session history contains id) { pull from there and return }
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

// Recursive call to retrieve entire discography through a single request -- do not use
/* const compileReleases = async (id, page = 1) => {
  try {
    const { artistId }  = req.params;
    const { artist } = req.body;
    let backup;
    // if (session history contains id) { pull from there and return }
    const results = await readArtistCredits(artistId)
    console.log(`Searching Discogs for ${artist}\n${results.pagination.pages} pages of results / ${results.pagination.items} items`);
    let  { releases } = results;

    // hold off on this until you successfully update the arcade fire backup
    if (results.pagination.pages >= 50) {
      backup = await backupService.checkBackup(artistId)
      if (typeof backup === 'object') {
        // figure out a way to return backup and update in background
        console.log('Returning backup')
        return res.json(backup);
      }
    }
    
    if (results.pagination.page < results.pagination.pages) {
      releases = releases.concat(await compileArtistCredits(artistId, 2));
    }

    if (backup == "update") {
      backupService.replaceBackup(artist, artistId, releases, releases.length);
      console.log(`Backup for ${artist} updated`);
    } else if (backup == "upload") {
      backupService.createBackup(artist, artistId, releases, releases.length);
      console.log(`Backup for ${artist} created`);
    }

    res.json(releases);
  } catch {
    err => res.status(400).json('Error: ' + err)
  }
} */

module.exports = {
  search,
  getArtist,
  getArtistReleases,
  getArtistReleasePage
}