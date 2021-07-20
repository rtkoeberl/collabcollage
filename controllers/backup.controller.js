const { backupService } = require('../services');

const {
  readBackup,
  createBackup,
  replaceBackup,
  removeBackup
} = backupService;

// 
const getBackup = (req, res) => {
  readBackup()
    .then(releases => {
      console.log('All backups retrieved')
      res.json(releases);
    })
    .catch(err => res.status(400).json('Error: ' + err))
};

// 
const getBackupById = (req, res) => {
  const { artistId }  = req.params;
  readBackup(artistId)
    .then(releases => {
      console.log(releases.length ? `Backup for ${releases[0].artist} retrieved` : `No existing backup`);
      res.json(releases); 
    })
    .catch(err => res.status(400).json('Error: ' + err))
};

// 
const postBackup = (req, res) => {
  const { artist, artistId, releases, items } = req.body;
  createBackup(artist, artistId, releases, items)
    .then(releases => {
      console.log(`Backup for ${artist} created`);
      res.json(releases);
    })
    .catch(err => res.status(400).json('Error: ' + err))
};

// 
const updateBackup = (req, res) => {
  const { artist, artistId, releases, items } = req.body;
  replaceBackup(artist, artistId, releases, items)
    .then(releases => {
      console.log(`Backup for ${artist} updated`);
      res.json(releases);
    })
    .catch(err => res.status(400).json('Error: ' + err))
};

// 
const deleteBackup = (req, res) => {
  const { artistId }  = req.params;
  removeBackup(artistId)
    .then(response => {
      console.log(response.n ? `Backup for artist (ID #${artistId}) deleted` : 'No artist with that ID found');
      res.json(response); 
    })
    .catch(err => res.status(404).json('Error: ' + err))
};

module.exports = {
  getBackup,
  getBackupById,
  postBackup,
  updateBackup,
  deleteBackup
};