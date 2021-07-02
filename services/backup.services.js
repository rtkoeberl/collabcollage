const Backup = require('../models/Backup')

// Retrieve backup of discography from db
const readBackup = async (artistId) => {
  try {
    return await Backup.find( artistId ? {artistId: artistId} : null )
  } catch(e) {
    throw new Error(e.message);
  }
}

// Create backup of discography to db
const createBackup = async (artist, artistId, releases, items) => {
  try {
    const newBackup = await new Backup({
      artist,
      artistId,
      releases,
      items: Number(items)
    })

    return newBackup.save()
  } catch(e) {
    throw new Error(e.message);
  }
}

// Update existing discography backup in db
const replaceBackup = async (artist, artistId, releases, items) => {
  try {
    return await Backup.updateOne(
      { artistId: artistId },
      {
        artist,
        artistId,
        releases,
        items: Number(items)
      }
    )
  } catch(e) {
    throw new Error(e.message)
  }
}

// Delete backup of discography from db
const removeBackup = async (artistId) => {
  try {
    return await Backup.deleteOne({ artistId: artistId })
  } catch(e) {
    throw new Error(e.message)
  }
}

// Retrieve backup and check if NO PUT THIS IN CONTROLLERS
const checkBackup = async (artistId, items) => {
  try {
    const backup = await Backup.find({artistId: artistId})
    if (backup[0]) {
      if (backup[0].items != items && backup[0].date.toDateString() != new Date(Date.now).toDateString() ) {
        console.log('Backup will be updated');
        backup[0].update = true;
        return backup[0];
      } else {
        console.log('Backup found');
        return backup[0].releases
      }
    } else {
      console.log('Backup will be created');
      return 'upload';
    }
  } catch(e) {
    throw new Error(e.message);
  }
}

module.exports =  {
  readBackup,
  createBackup,
  replaceBackup,
  removeBackup,
  checkBackup
};