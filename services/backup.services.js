const Backup = require('../models/Backup')

// Retrieve backup of discography from db
const readBackup = async (id) => {
  try {
    return await Backup.find( id ? {id: id} : null )
  } catch(e) {
    throw new Error(e.message);
  }
}

// Create backup of discography to db
const createBackup = async (name, id, releases, items) => {
  try {
    const newBackup = await new Backup({
      name,
      id,
      releases,
      items: Number(items)
    })

    return newBackup.save()
  } catch(e) {
    throw new Error(e.message);
  }
}

// Update existing discography backup in db
const replaceBackup = async (name, id, releases, items) => {
  try {
    return await Backup.updateOne(
      { id: id },
      {
        name,
        id,
        releases,
        items: Number(items),
        date: Date.now()
      }
    )
  } catch(e) {
    throw new Error(e.message)
  }
}

// Delete backup of discography from db
const removeBackup = async (id) => {
  try {
    return await Backup.deleteOne({ id: id })
  } catch(e) {
    throw new Error(e.message)
  }
}

// Retrieve backup and check if NO PUT THIS IN CONTROLLERS
const checkBackup = async (id, items) => {
  try {
    const backup = await Backup.find({id: id})
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