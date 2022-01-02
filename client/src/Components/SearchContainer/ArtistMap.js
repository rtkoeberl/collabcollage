import React, { useState, useEffect, createRef } from 'react';
import { ArtistTile } from './ArtistTile';
import { TempScrollBox } from '../../Util';

export function ArtistMap({artists, highlighted, highlightArtist}) {
  const [hovering, setHovering] = useState(false);
  const [overlayOn, setOverlayOn] = useState(false);
  const [clientHeightx, setClientHeight] = useState(0);
  const [scrollHeightx, setScrollHeight] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const artistRef = createRef();
  let scrollable = false;
  
  // Detects if the browser supports hovering scroll by default or otherwise detects scrollbar width to compensate
  useEffect(() => {
    let scrollbox = new TempScrollBox();
    setScrollWidth(scrollbox.width);
    if (scrollbox.width === 0) {
       setOverlayOn(true);
    }
    console.log(scrollbox.width);
  }, [])
  
  // Update client & scroll dimensions when the window resizes
  useEffect(() => {
    if (!overlayOn) {
      const getListSize = () => {
        if (artistRef.current.clientHeight && artistRef.current.scrollHeight) {
          const {clientHeight, scrollHeight} = artistRef.current;
          setClientHeight(clientHeight);
          setScrollHeight(scrollHeight);
        }
      };
      
      window.addEventListener("resize", getListSize);
      getListSize();
      return () => window.removeEventListener("resize", getListSize);
    }
  }, [overlayOn, artistRef]);
  
  // Makes scrollbar appear on mouse enter when content is scrollable
  const handleMouseEnter = (event) => {
    scrollable && setHovering(true);
  }
  const handleMouseLeave = (event) => {
    scrollable && setHovering(false);
  }

  if (!overlayOn) {
    if (clientHeightx < scrollHeightx) {
      scrollable = true;
    } else {
      scrollable = false;
    }
  }

  const mapStyles = {
    width: `calc(85% + ${overlayOn ? 30 : scrollWidth}px)`,
    marginRight: `calc(7.5% - ${overlayOn ? 15 : scrollWidth}px)`,
    marginLeft: `calc(7.5% - ${overlayOn ? 15 : 0}px)`
  };

  const overlayStyles = {
    maskImage: `linear-gradient(to top, transparent, black), linear-gradient(to left, transparent ${scrollWidth}px, black ${scrollWidth}px)`,
    WebkitMaskImage: `linear-gradient(to top, transparent, black), linear-gradient(to left, transparent ${scrollWidth}px, black ${scrollWidth}px)`,
    maskSize: '100% 10000%',
    WebkitMaskSize: '100% 10000%',
    maskPosition: hovering ? 'left top' : 'left bottom',
    WebkitMaskPosition: hovering ? 'left top' : 'left bottom',
    transition: 'mask-position 0.3s, -webkit-mask-position 0.3s'
  };
  
  const tileStyles = {
    marginRight: `${overlayOn ? 18 : 3}px`,
    marginLeft: `${overlayOn ? 18 : 3}px`,
  }

  return (
    <div
      id="artistTiles"
      ref={artistRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={ overlayOn ? mapStyles : {...mapStyles, ...overlayStyles} }
    >
      {artists.map(artist =>
        (<ArtistTile
          artist={artist} 
          key={artist.id} 
          length={artists.length}
          highlightArtist={highlightArtist}
          highlighted={highlighted}
          tileStyles = {tileStyles}
        />)
      )}
    </div>
  )
}