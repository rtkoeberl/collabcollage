const { backupService } = require('../services');

const {
  getBackup,
  getBackupById,
  postBackup,
  updateBackup,
  deleteBackup
} = backupService;



router.get('/', (req, res) => {
  Backup.find()
    .then(releases => res.json(releases))
    .catch(err => res.status(400).json('Error: ' + err))
});


router.get('/:artistId', (req, res) => {
  Backup.find({ artistId: req.params.artistId })
    .then(release => res.json(release))
    .catch(err => res.status(400).json('Error: ' + err))
})


router.post('/', (req, res) => {
  const newBackup = new Backup({
    artist: req.body.artist,
    artistId: req.body.artistId,
    releases: req.body.releases,
    items:  req.body.items
  })

  newBackup.save().then(releases => res.json(releases))
})


module.exports = router;