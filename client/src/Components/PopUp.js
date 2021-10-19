import React from 'react';

export function PopUp({ showPopUp, togglePopUp }) {
  return ( showPopUp ) ? (
    <div className="popUp">
      <div className="popUp--window">
        <button className="button" onClick={() => togglePopUp(false)}>
          <p>✕</p>
        </button>
        <h3>About CollabCollage</h3>
        <p>CollabCollage is a website designed to find instances of collaboration between two or more musical acts. It accomplishes this using data from <a href="https://www.discogs.com" target="_blank" rel="noreferrer">Discogs</a>. As this API is rate limited, it backs up recent searches locally, and copies larger discographies to a MongoDB database for quicker access.</p>
        <p>Due to the nature of the data provided, CollabCollage cannot yet distinguish between performance and writing credits. As such, some results may be considered more "crossovers" than true collaborations.</p>
        <p>CollabCollage was developed by <a href="https://rosskoeberl.online" target="_blank" rel="noreferrer">Ross Koeberl</a>.</p>
      </div>
    </div>
  ) : ""
} 