const router = require('express').Router();
const { backup, discogs } = require('../controllers');

// Backup routes
router.get('/backup', backup.getBackup);
router.get('/backup/:id', backup.getBackupById);
router.post('/backup', backup.postBackup);
router.post('/backup/:id', backup.updateBackup);
router.delete('/backup/:id', backup.deleteBackup);

// Discog routes
router.get('/discog/search/:artist', discogs.search);
router.get('/discog/:artistId', discogs.getArtist);
router.get('/discog/:artistId/releases', discogs.getArtistReleases);
router.get('/discog/:artistId/releases/:page', discogs.getArtistReleasePage);

module.exports = router;