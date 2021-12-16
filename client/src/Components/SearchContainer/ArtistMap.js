import React, { useState, useEffect, useCallback, createRef } from 'react';
import { ArtistTile } from './ArtistTile';
import { TempScrollBox } from '../../Util';

export function ArtistMap({artists, highlighted, highlightArtist}) {
  const [scrollable, setScrollable] = useState(false);
  const [hovering, setHovering] = useState(false);
  const artistRef = createRef();
  const buttonRef = createRef();
  let clearButton;

  let scrollbox = new TempScrollBox();
  let scrollWidth = scrollbox.width;

  const getListSize = useCallback(() => {
    const clientHeight = artistRef.current.clientHeight;
    const scrollHeight = artistRef.current.scrollHeight;

    if (clientHeight < scrollHeight) {
      setScrollable(true);
    } else {
      setScrollable(false);
    }
  }, [artistRef]);
  
  // Update client & scroll dimensions when artist list updates
  useEffect(() => {
    getListSize();
  }, [artists, getListSize]);

  // Update client & scroll dimensions when the window resizes
  useEffect(() => {
    window.addEventListener("resize", getListSize);
    return window.removeEventListener("resize", getListSize);
  }, [getListSize]);

  const handleMouseEnter = (event) => {
    scrollable && setHovering(true);
  }
  const handleMouseLeave = (event) => {
    scrollable && setHovering(false);
  }

  if (artists.length) {
    clearButton = (
      <div id="clearButton" ref={buttonRef}>
        <button className='btn'>Clear all artists</button>
      </div>
    )
  } else {
    clearButton = '';
  }

  return (
    <div
      id="artistTiles"
      ref={artistRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: `calc(85% + ${scrollWidth}px)`,
        marginRight: `calc(7.5% - ${scrollWidth}px)`,
        maskImage: `linear-gradient(to top, transparent, black), linear-gradient(to left, transparent ${scrollWidth}px, black ${scrollWidth}px)`,
        WebkitMaskImage: `linear-gradient(to top, transparent, black), linear-gradient(to left, transparent ${scrollWidth}px, black ${scrollWidth}px)`,
        maskSize: '100% 10000%',
        WebkitMaskSize: '100% 10000%',
        maskPosition: hovering ? 'left top' : 'left bottom',
        WebkitMaskPosition: hovering ? 'left top' : 'left bottom',
        transition: 'mask-position 0.3s, -webkit-mask-position 0.3s'
      }}
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