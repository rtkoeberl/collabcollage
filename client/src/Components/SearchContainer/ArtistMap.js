import React, { useState, useEffect, createRef } from 'react';
import { ArtistTile } from './ArtistTile';
import { TempScrollBox } from '../../Util';

export function ArtistMap({artists, highlighted, highlightArtist, searchAll}) {
  const [hovering, setHovering] = useState(false);
  const [overlayScroll, setOverlayScroll] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const artistRef = createRef();
  
  // Detects if the browser supports hovering scroll by default or otherwise detects scrollbar width to compensate
  useEffect(() => {
    let scrollbox = new TempScrollBox();
    setScrollWidth(scrollbox.width);
    if (scrollbox.width === 0) {
       setOverlayScroll(true);
    }
  }, [])
  
  // Update client & scroll dimensions when the window resizes
  useEffect(() => {
    if (!overlayScroll) {
      const getListSize = () => {
        if (artistRef.current) {
          const {clientHeight, scrollHeight} = artistRef.current;
          if (clientHeight < scrollHeight) {
            setScrollable(true);
          } else {
            setScrollable(false);
          }
        } else {
          setScrollable(false);
        }
      };
      
      window.addEventListener("resize", getListSize);
      getListSize();
      return () => window.removeEventListener("resize", getListSize);
    }
  }, [overlayScroll, artistRef]);
  
  // Makes scrollbar appear on mouse enter when content is scrollable
  const handleMouseEnter = (event) => {
    scrollable && setHovering(true);
  }
  const handleMouseLeave = (event) => {
    scrollable && setHovering(false);
  }

  const mapStyles = {
    width: `calc(85% + ${overlayScroll ? 30 : scrollWidth}px)`,
    marginRight: `calc(7.5% - ${overlayScroll ? 15 : scrollWidth}px)`,
    marginLeft: `calc(7.5% - ${overlayScroll ? 15 : 0}px)`
  };

  const overlayStyles = {
    maskImage: `linear-gradient(to top, transparent, black), linear-gradient(to left, transparent ${scrollWidth}px, black ${scrollWidth}px)`,
    WebkitMaskImage: `linear-gradient(to top, transparent, black), linear-gradient(to left, transparent ${scrollWidth}px, black ${scrollWidth}px)`,
    maskSize: '100% 10000%',
    WebkitMaskSize: '100% 10000%',
    maskPosition: scrollable && hovering ? 'left top' : 'left bottom',
    WebkitMaskPosition: scrollable && hovering ? 'left top' : 'left bottom',
    transition: 'mask-position 0.3s, -webkit-mask-position 0.3s'
  };
  
  const tileStyles = {
    marginRight: `${overlayScroll ? 18 : 3}px`,
    marginLeft: `${overlayScroll ? 18 : 3}px`,
  }

  return (
    <div
      id="artistTiles"
      ref={artistRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={ overlayScroll ? mapStyles : {...mapStyles, ...overlayStyles} }
    >
      {artists.map(artist =>
        (<ArtistTile
          artist={artist} 
          key={artist.id} 
          length={artists.length}
          highlightArtist={highlightArtist}
          highlighted={highlighted}
          tileStyles={tileStyles}
          searchAll={searchAll}
        />)
      )}
    </div>
  )
}