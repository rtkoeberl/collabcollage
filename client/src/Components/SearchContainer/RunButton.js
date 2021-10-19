import React, { useState, useEffect } from 'react';

export function RunButton ({ artists, runCompare, onRun, toggleSidebar }) {
  const [canSearch, setCanSearch] = useState(false);
  const [buttonMessage, setButtonMessage] = useState('Add Artists to Begin');
  let artistLimit = 8;

  useEffect(
    () => {
      if (!runCompare) {
        if (artists.length > artistLimit) {
          setCanSearch(false);
          setButtonMessage('Too many artists, please delete one!');
        } else if (artists.length > 1 && artists.length <= artistLimit) {
          if (artists.every(a => a.releases.length)) {
            setCanSearch(true);
            setButtonMessage('Generate Discog')
          } else {
            setCanSearch(false);
            setButtonMessage('Loading Artist Data...')
          }
        } else {
          setCanSearch(false);
          setButtonMessage('Add Artists to Begin');
        }
      } else {
        setButtonMessage('Stop Search')
      }
    }, [artists, runCompare]
  )

  const handleRun = () => {
    if (!runCompare) {
      onRun(true);
      if (window.innerWidth <= 500) {
        toggleSidebar(true);
      }
    } else {
      onRun(false);
    }
  }

  return (
    <div id="runButton">
      <button className="btn" onClick={() => handleRun()} disabled={!canSearch}>{buttonMessage}</button>
    </div>)
}