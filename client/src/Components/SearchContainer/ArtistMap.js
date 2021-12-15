import React, { useState, useEffect, createRef } from 'react';
import { ArtistTile } from './ArtistTile';

export function ArtistMap({artists, highlighted, highlightArtist}) {
  const [scrollWidth, setScrollWidth] = useState(0);
  const artistRef = createRef();
  const buttonRef = createRef();
  // let scrollWidth = 0;
  let clearButton;

  useEffect(() => {
    if (buttonRef.current) {
      let clientHeight = artistRef.current.clientHeight; 
      let scrollHeight = artistRef.current.scrollHeight;
      if (clientHeight < scrollHeight) {
        console.log('big');
        setScrollWidth(artistRef.current.offsetWidth - buttonRef.current.offsetWidth);
      } else {
        setScrollWidth(0);
      }
      
    }
  }, [buttonRef, artistRef, setScrollWidth])

  // const setScroll = (width) => {
  //   setScrollWidth(width);
  // }


  if (artists.length) {
    clearButton = (
      <div id="clearButton" ref={buttonRef}>
        <button>Clear all artists</button>
      </div>
    )
  } else {
    clearButton = '';
  }

  let artistRefStyle = {
    width: `calc(85% + ${scrollWidth}px)`,
    marginRight: `calc(7.5% - ${scrollWidth}px)`,
    maskImage: `linear-gradient(to top, transparent, black), linear-gradient(to left, transparent ${scrollWidth}px, black ${scrollWidth}px)`,
    WebkitMaskImage: `linear-gradient(to top, transparent, black), linear-gradient(to left, transparent ${scrollWidth}px, black ${scrollWidth}px)`,
  }

  return (
    <div
      id="artistTiles"
      className={scrollWidth > 0 && '.artistTilesScroll'}
      ref={artistRef}
      style={artistRefStyle}
    >
      {artists.map(artist =>
        (<ArtistTile
          artist={artist} 
          key={artist.id} 
          length={artists.length}
          highlightArtist={highlightArtist}
          highlighted={highlighted}
        />)
      )}
      {clearButton}
    </div>
  )
}