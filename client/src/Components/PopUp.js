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
        <h3>Welcome to CollabCollage!</h3>
        <p>
          This website allows you to quickly discover collaborations between musical artists, using data from <a href="https://www.discogs.com" target="_blank" rel="noreferrer">Discogs</a>.
        </p>
        <p>
          To begin, use the search box to pick two or more artists, then run your search to discover if and when their careers crossed paths. To focus your search around a single artist's career, you can select the check box next to their name.
        </p>
        <p>
          Due to the nature of the data provided, CollabCollage cannot yet distinguish between performance and writing credits. As such, some results may be considered more "crossovers" than true collaborations.
        </p>
        <p>
          CollabCollage was developed by <a href="https://rosskoeberl.online" target="_blank" rel="noreferrer">Ross Koeberl</a>. You can read more about its development <a href="https://github.com/rtkoeberl/collabcollage" target="_blank" rel="noreferrer">here</a>.
        </p>
      </div>
    </div>
  ) : ""
} 