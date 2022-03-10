import React, { useState, useEffect } from 'react';
import { updateLoadProgress, deepCopy, commaSeparate } from '../../Util';
import { AlbumTile } from './AlbumTile';
import { LoadingDots } from '../LoadingDots';

export function AlbumGrid({ state, onGetCredits, onReset, pauseBackup }) {
  const [loadPercent, setLoadPercent] = useState([]);
  const [currentArtists, setCurrentArtists] = useState([]);
  const [collabs, setCollabs] = useState([]);
  let {
    artists,
    runCompare,
    hideComps,
    hideUnofficial,
    hideSidebar,
    hideVarious,
    highlighted,
    searchAll
  } = state;
  let loading;
  let headline = "Search results will appear here";
  let headlineActive = false;


  useEffect(
    () => {
      const findCollabs = () => {
        const musicians = deepCopy(artists);
        const collabArr = [];
    
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
              if (typeof item.role === 'string') {
                item.role = [item.role];
              }
              output.push(item)
            }
          });
          musician.releases = output;
        })
    
        // find matching entries
        for (let i = 0; i < musicians.length - 1; i++) {
          // console.log(`Comparing ${musicians[i].name}...`)
          for (let j = i+1; j < musicians.length; j++) {
            if (j > i) {
              // console.log(`...with ${musicians[j].name}`)
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
                        year: Math.min(r1.year, r2.year),
                        format: r1.format,
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
              // console.log(`...with nobody else!`)
            }
          }
        }

        // console.log(collabArr)
        setCollabs(collabArr)
      }

      if ( runCompare ) {
        setCurrentArtists(artists.map(a => a.name))
        const load = updateLoadProgress(artists);
        setLoadPercent(load.totalLoaded);
        findCollabs();

        if (load.nextIndex !== null) {
          let { id: artistId, page } = artists[load.nextIndex];
          onGetCredits( artistId, page + 1, load.nextIndex );
        } else {
          onReset(false);
          console.log("Resetting");
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

  const filterCollabs = (clb) => {
    let status = true;

    let isUnoff = clb.collaborators.every(clbr => clbr.roles.includes("UnofficialRelease"));
    let isApp = clb.collaborators.some(clbr => clbr.roles.includes("Appearance"));

    if (hideComps) {
      let isMain = clb.collaborators.some(clbr => clbr.roles.includes("Main"));
      // let isApp = clb.collaborators.some(clbr => clbr.roles.includes("Appearance"));
      let isTrApp = clb.collaborators.some(clbr => clbr.roles.includes("TrackAppearance"));
      if (isTrApp && !isMain && !(isUnoff && isApp)) {
        status = false
      }
      let isComp = clb.format ? clb.format.includes("Comp") : false;
      if (isComp) {
        status = false
      }
    }

    if (hideUnofficial) {
      if (isUnoff && !isApp) {
        status = false
      }
    }

    if (hideVarious) {
      if (clb.artist === "Various" || clb.artist === "Unknown" || clb.artist === "Unknown Artist") {
        status = false
      }
    }

    if (highlighted.id) {
      let featuresHighlighted = clb.collaborators.some(clbr => clbr.id === highlighted.id);
      if (!featuresHighlighted) {
        status = false;
      }
    }

    if (searchAll) {
      if (clb.collaborators.length !== artists.length) {
        status = false
      }
    }

    return status;
  }

  function sortByYear(a, b) {
    if (a.year < b.year) return -1;
    if (a.year > b.year) return 1;
    return 0;
  }

  if (loadPercent.length) {
    if (loadPercent[0] !== loadPercent[1]) {
      loading = (
        <div className="loadResultBox">
          { runCompare ? <LoadingDots color="white" /> : null }
          <p>Load Progress: {loadPercent[0]} / {loadPercent[1]}</p>
          <p>Possible Collabs: {collabs.filter(filterCollabs).length}</p>
        </div>
      )
    } else {
      if (collabs.filter(filterCollabs).length === 0) {
        loading = (
          <div className="loadResultBox">
            <p><strong>No collaborations found!</strong></p>
          </div>
        )
      } else {
        loading = (
          <div className="loadResultBox">
            <p>Possible Collabs: {collabs.filter(filterCollabs).length}</p>
          </div>
        )
      }
    }
    
  } else {
    loading = null; // Place a welcome message here!
  }
  
  // Set Banner Message
  if (currentArtists.length) {
    headlineActive = true;
    if (highlighted.name === null) {
      headline = `Results for ${commaSeparate(currentArtists)}`;
    } else {
      headline = `Results for ${highlighted.name} and either ${commaSeparate(currentArtists.filter(e => e !== highlighted.name), 'or')}`
    }
    
  }

  return (
    <div className={`albumArea ${hideSidebar ? 'hideSidebar--grid' : ''}`}>
      <div id="collageHeader"><h3 className={!headlineActive ? 'headlineInactive' : ''}>{headline}</h3></div>
      {loading}
      <div id="albumGrid">
        {collabs.filter(filterCollabs).sort(sortByYear).map((album, id) => {
          return <AlbumTile key={id} album={album} pauseBackup={pauseBackup} />
        })}
      </div>
    </div>
  )
}