import React, { useState, useEffect } from 'react';
import { updateLoadProgress, deepCopy } from '../../Util';
import './AlbumGrid.css';

export function AlbumGrid({ state: { artists, runCompare }, onGetCredits, onReset }) {
  const [loadPercent, setLoadPercent] = useState([]);
  const [collabs, setCollabs] = useState([]);
  // const [loadMsg, setLoadMsg] = useState('');

  useEffect(
    () => {
      const findCollabs = () => {
        let musicians = deepCopy(artists);
        let collabArr = [];
    
        // Combine duplicate entries in each discography
        musicians.forEach(musician => {
          let output = [];
          musician.releases.forEach((item) => {
            let existing = output.filter(r => {
              if (r.id_m) {
                return r.id_m === item.id_m;
              }
              return r.id_r === item.id_r
            });
            if (existing.length) {
              let existingIndex = output.indexOf(existing[0]);
              output[existingIndex].role = output[existingIndex].role.concat(item.role);
            } else {
              if (typeof item.role == 'string') {
                item.role = [item.role];
              }
              output.push(item)
            }
          });
          musician.releases = output;
        })
    
        console.log(musicians)
    
        // find matching entries
        for (let i = 0; i < musicians.length; i++) {
          console.log(`Comparing ${musicians[i].name}...`)
          for (let j = 1; j < musicians.length; j++) {
            if (j > i) {
              console.log(`...with ${musicians[j].name}`)
              musicians[i].releases.forEach(r1 => {
                musicians[j].releases.forEach(r2 => {
                  // If two releases match
                  if (
                    (r1.id_m && r1.id_m === r2.id_m) ||
                    (r1.id_r === r2.id_r)
                  ) {
                    // Check to see if they've already been added to the collab array
                    let exists = collabArr.filter(c => r1.id_m ? r1.id_m === c.id_m : r1.id_r === c.id_r);
                    if (exists.length) {
                      // And if so, add the missing artist to the list of collaborators
                      console.log('Oh, this already exists!')
                      let ci = collabArr.indexOf(exists[0]);
                      if (collabArr[ci].collaborators.map(r => r._id).indexOf(j) === -1) {
                        collabArr[ci].collaborators.push({
                          _id: j,
                          artist: musicians[j].name,
                          id: musicians[j].id,
                          roles: r2.role
                        })
                      }
                    } else {
                      let collabObj = {
                        artist: r1.artist,
                        id_m: r1.id_m,
                        id_r: r1.id_r,
                        resource_url: r1.resource_url,
                        thumb: r1.thumb,
                        title: r1.title,
                        year: r1.year,
                        collaborators: [
                          {
                            _id: i,
                            artist: musicians[i].name,
                            id: musicians[i].id,
                            roles: r1.role
                          },
                          {
                            _id: j,
                            artist: musicians[j].name,
                            id: musicians[j].id,
                            roles: r2.role
                          }
                        ]
                      }
    
                      collabArr.push(collabObj);
                    }
                  }
                })
              })
            } else {
              console.log(`...with nobody else!`)
            }
          }
        }
        
        console.log(collabArr)
        setCollabs(collabArr);
      }

      if ( runCompare ) {
        const load = updateLoadProgress(artists);
        setLoadPercent(load.totalLoaded);
        findCollabs();
        console.log(load.nextIndex)
        if (load.nextIndex !== null) {
          let { id: artistId, page } = artists[load.nextIndex];
          onGetCredits( artistId, page + 1, load.nextIndex );
        } else {
          if (load.totalLoaded.every(l => l === 1)) {
            onReset(false);
            console.log("Resetting");
          } else {
            console.log('What happened?')
          }
          // place logic for uploading backups to mongo here!
        }
      }
    },
    [
      artists,
      runCompare,
      onReset,
      onGetCredits,
    ]
  )

  return (
    <div>
      <div className="sidebyside">
          {artists.map(a => (
            <div className={a.page === a.pages && a.page !== 0 ? "artistBlock complete" : "artistBlock"} key={a.id}>
              <p><strong>{a.name} (Artist #{a.id})</strong></p>
              <p>Page {a.page} / {a.pages}</p>
              <p>Releases: {a.releases ? a.releases.length : 0} / {a.items}</p>
            </div>
          ))}
        </div>
        {loadPercent.length && loadPercent[0] !== loadPercent[1] ? <div>Load Percent: {loadPercent[0]} / {loadPercent[1]}</div> : null}
        <div>Results: {collabs.length ? collabs.length : 0}</div>
    </div>
  )
}