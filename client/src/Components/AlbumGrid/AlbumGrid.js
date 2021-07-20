import React, { useState, useEffect } from 'react';
import { updateLoadProgress } from '../../Util';
import './AlbumGrid.css';

export function AlbumGrid({ state: { artists, runCompare }, onGetCredits, onReset }) {
  const [loadPercent, setLoadPercent] = useState([]);
  // const [collabs, setCollabs] = useState([])

  useEffect(
    () => {
      if ( runCompare ) {
        const load = updateLoadProgress(artists);
        setLoadPercent(load.totalLoaded);
        console.log(load.nextIndex)
        // run comparison
        if (load.nextIndex !== null) {
          let { id: artistId, page } = artists[load.nextIndex];
          onGetCredits( artistId, page + 1, load.nextIndex );
        } else {
          onReset(false);
          console.log("Resetting");
        }
      }
    },
    [ artists, runCompare, onGetCredits ]
  )


  return (
    <div>
      {/* <button>Temp Button</button> */}
      <div className="sidebyside">
          {artists.map(a => (
            <div className="artistBlock" key={a.id}>
              <p><strong>{a.name} (Artist #{a.id})</strong></p>
              <p>Page {a.page} / {a.pages} ({a.items} items)</p>
              <p>Releases: </p><ul>{a.releases ? a.releases.map(r => <li key={r.key}>{r.key}. <strong>{r.artist}</strong>'s {r.title}</li>) : ''}</ul>
            </div>
          ))}
        </div>
    </div>
  )
}