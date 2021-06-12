const router = require('express').Router();

const { discogs, backup } = require('../controllers');

// Backup routes
router.get('/backup', backup.getBackup);
router.get('/backup/:artistId', backup.getBackupById);
router.post('/backup', backup.addBackup);
router.post('/backup/:artistId', backup.updateBackup);
router.delete('/backup/:artistId', backup.deleteBackup);

// Discog routes
router.get('/discog/search', discogs.search);
router.get('/discog/:artistId/artist', discogs.getArtist);
router.get('/discog/:artistId/releases', discogs.getDiscog);

module.exports = router;
