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
  const { id }  = req.params;
  readBackup(id)
    .then(releases => {
      console.log(releases.length ? `Backup for ${releases[0].name} retrieved` : `No existing backup`);
      res.json(releases); 
    })
    .catch(err => res.status(400).json('Error: ' + err))
};

// 
const postBackup = (req, res) => {
  const { name, id, releases, items } = req.body;
  createBackup(name, id, releases, items)
    .then(releases => {
      console.log(`Backup for ${name} created`);
      res.json(releases);
    })
    .catch(err => res.status(400).json('Error: ' + err))
};

// 
const updateBackup = (req, res) => {
  const { name, id, releases, items } = req.body;
  replaceBackup(name, id, releases, items)
    .then(releases => {
      console.log(`Backup for ${name} updated`);
      res.json(releases);
    })
    .catch(err => res.status(400).json('Error: ' + err))
};

// 
const deleteBackup = (req, res) => {
  const { id }  = req.params;
  removeBackup(id)
    .then(response => {
      console.log(response.n ? `Backup for artist (ID #${id}) deleted` : 'No artist with that ID found');
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