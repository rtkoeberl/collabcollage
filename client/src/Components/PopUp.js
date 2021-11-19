import React from 'react';
import ls from 'local-storage';

export function PopUp({ showPopUp, togglePopUp }) {
  function closePopUp() {
    let returnVisit = ls.get('returnVisit');
    if (!returnVisit) {
      ls.set('returnVisit', true);
      console.log(ls.get('returnVisit'))
    }
    togglePopUp(false);
  }

  return ( showPopUp ) ? (
    <div className="popUp">
      <div className="popUp--window">
        <button className="button" onClick={() => closePopUp()}>
          <p>✕</p>
        </button>
        <h3>About CollabCollage</h3>
        <p>
          Welcome to CollabCollage, a website that allows you to quickly discover collaborations between multiple musical artists, using data from <a href="https://www.discogs.com" target="_blank" rel="noreferrer">Discogs</a>. To begin, use the search box to select two or more artists, then run your search to discover if and when their careers crossed paths. In addition, you can select the check box on a single artist in order to focus your search around their career.
        </p>
        <p>
          The Discogs API rate limits queries to 100 release per second. In order to provide quicker results, CollabCollage backs up recent searches locally and copies larger discographies to a MongoDB database. Due to the nature of the data provided, CollabCollage cannot yet distinguish between performance and writing credits. As such, some results may be considered more "crossovers" than true collaborations. We still think they're neat.
        </p>
        <p>
          CollabCollage was developed by <a href="https://rosskoeberl.online" target="_blank" rel="noreferrer">Ross Koeberl</a>.
        </p>
      </div>
    </div>
  ) : ""
} 