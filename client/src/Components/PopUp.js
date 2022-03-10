import React from 'react';
import ls from 'local-storage';

export function PopUp({ showPopUp, togglePopUp }) {
  let returnVisit = ls.get('returnVisit');

  function closePopUp() {
    if (!returnVisit) {
      ls.set('returnVisit', true);
      console.log(ls.get('returnVisit'))
    }
    togglePopUp(false);
  }

  return ( showPopUp ) ? (
    <div className="popUp" onClick={() => closePopUp()}>
      <div className="popUp--window" onClick={e => e.stopPropagation()}>
        <button className="button" onClick={() => closePopUp()}>
          <p>✕</p>
        </button>
        <h3>Welcome to CollabCollage!</h3>
        <p>
          This website allows you to discover collaborations, covers, and other career crossovers between musical artists, using data from <a href="https://www.discogs.com" target="_blank" rel="noreferrer">Discogs</a>.
        </p>
        <p>
          To begin, use the search box to pick two or more artists, then run your search to discover if and when their careers crossed paths. To specifically find one artist's crossovers with all other artists, select the check box next to their name.
        </p>
        <p>
          CollabCollage was developed by <a href="https://rosskoeberl.online" target="_blank" rel="noreferrer">Ross Koeberl</a>. You can read more about its development <a href="https://github.com/rtkoeberl/collabcollage" target="_blank" rel="noreferrer">here</a>.
        </p>
      </div>
    </div>
  ) : ""
} 