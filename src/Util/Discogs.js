// Authorize Discogs via Disconnect
const Disconnect = require('disconnect').Client;
const db = new Disconnect('CollabCollage/0.1', {
  consumerKey: process.env.REACT_APP_CONSUMER_KEY,
  consumerSecret: process.env.REACT_APP_CONSUMER_SECRET
}).database();
let lengthCheck = false;

const Discogs = {
  search(artist) {
    return db.search(artist, { type: 'artist' })
      // .then(data => {
      //   return data.results.foreach(result => {
      //     what do i do with this data
      //     (I want result.id and result.title and maybe result.cover_image)
      //    })
      //  });
  },

  getArtist(id) {
    // LATER: if artistID passed in is a band, find each member and run getCredits again with their ID's
    return db.getArtist(id);
  },

  getCredits(id, page = 1) {
    console.log(`Returning page ${page}!`)
    // if (id has already been saved from this session) { pull from there and return }
    // if (id exists in special json doc) { pull as sqlresult}
    return db.getArtistReleases(id, {sort: 'year', page: page, per_page: 100})
      .then(async results => {
        if (!lengthCheck) {
          lengthCheck = true;
          console.log(`lengthCheck set to true\n${results.pagination.pages} pages of results`);
          // If sqlresult > if results.pagination.items == sqlresult.releases.length return sqlresult.releases else settoken
        }
        let releases = results.releases;
        if (results.pagination.page < results.pagination.pages) {
          return releases.concat(await Discogs.getCredits(id, page+1))
        } else {
          lengthCheck = false;
          console.log('lengthCheck set to false');
          return releases;
        }
      });
    // Recursive function to deliver all artist credits via pages of 100 results
    // AFTER THIS: Filter results / LATER: filter by year
  },

  getRelease(id) {
    return db.getRelease(id)
  }
}

export default Discogs;