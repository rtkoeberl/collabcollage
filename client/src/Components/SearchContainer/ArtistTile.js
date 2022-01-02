import React from 'react';
import { LoadingDots } from '../LoadingDots';

export function ArtistTile({ artist, length, highlightArtist, highlighted, tileStyles }) {
  let excerpt = '';
  let complete = artist.page === artist.pages && artist.page !== 0 ? " complete" : '';
  let highlight = highlighted.id === artist.id ? " highlight" : '';
  let name = artist.name.replace(/\s\(\d+\)/ig, '');
  const strLength = 225;
  let highlightButton = '';
  
  if (artist.profile) {
    const profile = artist.profile
      .replace(/\[\/*[bi]\]/g, '')
      .replace(/\[url=[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)\]/g, '')
      .replace(/\[\/url\]/g, '')
      .replace(/\[[al]=/g, '')
      .replace(/[[\]]/g, '')
      .replace(/\r\n\r\n/g, '\n');
    
    if (profile.length > strLength) {
      excerpt = profile.substring(0,strLength).replace(/[.(\r\n)]*\s+[\w\d]+(\r\n)*$/i, ' ').concat('...');
    } else {
      excerpt = profile.replace(/(\r\n)*$/, ' ');
    }
  }

  if (length > 2) {
    highlightButton = (
      <div className="highlightBtn">
        <input
          type="checkbox"
          name="highlight"
          checked={highlighted.id === artist.id}
          onChange={() => highlightArtist(artist, highlighted)}
        />
        <label>View only collaborations with {name}</label>
      </div>
      
    );
  } else {
    highlightButton = '';
  }
  
  return(
    <div
      className={"artistTile" + complete + highlight}
      style={tileStyles}
    >
      <div className="artistImgBox">
        <a href={artist.uri} target="_blank" rel="noreferrer">
          {artist.image ? <img className="artistImg" src={artist.image} alt={artist.name}></img> : <LoadingDots color="black" />}
        </a>
      </div>
      <div className="artistInfoBox">
        <p><strong>{name}</strong></p>
        {artist.uri &&
          <div className="excerpt">
            <div className='excerpt--text'>
              <p>{excerpt}</p>
            </div>
            <div className="link-btn">
              <a href={artist.uri} target="_blank" rel="noreferrer">Read More</a>
            </div>
          </div>
        }
      </div>
      {highlightButton}
    </div>
  )
}