// Authorize Discogs via Disconnect
const Disconnect = require('disconnect').Client;
const db = new Disconnect('CollabCollage/0.1', {
  consumerKey: process.env.REACT_APP_CONSUMER_KEY,
  consumerSecret: process.env.REACT_APP_CONSUMER_SECRET
}).database();

// Set 1-Request-per-Second limit with Bottleneck
const Bottleneck = require("bottleneck");
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000
});

// Booleans for...
// > if length-in-pages has been checked on initial credits search
let lengthCheck = false;
// > if the results should be uploaded or updated on the mongoDb server
let uploadResults = false;
let updateResults = false;

const Discogs = {
  search(artist) {
    return limiter.schedule(() => db.search(artist, { type: 'artist' }))
      // .then(data => {
      //   return data.results.foreach(result => {
      //     what do i do with this data
      //     (I want result.id and result.title and maybe result.cover_image)
      //    })
      //  });
  },

  getArtist(id) {
    // LATER: if artistID passed in is a band, find each member and run getCredits again with their ID's
    return limiter.schedule(() => db.getArtist(id));
  },

  getCreditsFromDb(id) {
    // if (session history contains id) { pull from there and return }
    return limiter.schedule(() => db.getArtistReleases(id, {sort: 'year', page: 1, per_page: 100}))
      .then(async results => {
        
        console.log(`Searching Discogs...\n${results.pagination.pages} pages of results`);
        let releases = results.releases;

        // Check length against mongoDb policy
        if (results.pagination.pages >= 50) {
        //   if (`server/api/discog/${id}`) {
        //     if (results.pagination.items != apiCall.result.items && apiCall.date.toDateString() != Date.now.toDateString() ) {
        //       updateResults = true;
        //     } else {
        //       return apiCall.results.releases
        //     }
        //   } else {
        //     uploadResults = true;
        //   }
        // also hey what if updating the results brought you down an alternate path where you just uploaded the LAST item added?
        }
        
        // Initiate recursive getCredits call if results have more than one page
        if (results.pagination.page < results.pagination.pages) {
          releases.concat(await Discogs.getCredits(id, 2))
          if (uploadResults) {
          //  upload the dang results to mongodb
           uploadResults = false 
          }
          if (updateResults) {
          //  update the dang results to mongodb
           updateResults = false 
          }
        }

        lengthCheck = false;
        console.log('lengthCheck set to false');
        return releases;
        
      })
  },

  getCredits(id, page = 1) {
    console.log(`Returning page ${page}!`)
    
    return limiter.schedule(() => db.getArtistReleases(id, {sort: 'year', page: page, per_page: 100}))
      .then(async results => {
        let releases = results.releases;
        if (results.pagination.page < results.pagination.pages) {
          return releases.concat(await Discogs.getCredits(id, page+1))
        } else {
          lengthCheck = false;
          console.log('lengthCheck set to false');
          // if (updateResults) { update results }
          // if (uploadResults) { upload results }
          return releases;
        }
      });
  },

  getLastPage(id) {

  },

  getRelease(id) {
    return limiter.schedule(() => db.getRelease(id))
  }
}

// export default Discogs;