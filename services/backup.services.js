const Backup = require('../models/Backup')

const readBackup = async (artistId) => {
  try {
    return Backup.find( artistId ? {artistId: artistId} : null )
  } catch(e) {
    throw new Error(e.message);
  }
}

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

const replaceBackup = async (artist, artistId, releases, items) => {
  try {
    return Backup.updateOne(
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

const removeBackup = async (artistId) => {
  try {
    return Backup.deleteOne({ artistId: artistId })
  } catch(e) {
    throw new Error(e.message)
  }
}

module.exports =  {
  readBackup,
  createBackup,
  replaceBackup,
  removeBackup
};