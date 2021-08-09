import React, { useState, useEffect } from 'react';

export function RunButton ({ artists, onRun }) {
  const [canSearch, setCanSearch] = useState(false);

  useEffect(
    () => {
      if (artists.length > 1 && artists.every(a => a.releases.length)) {
        setCanSearch(true)
      } else {
        setCanSearch(false)
      }
    }, [artists]
  )

  return (<button id="runButton" onClick={() => onRun(true)} disabled={!canSearch}>Generate Discog</button>)
}