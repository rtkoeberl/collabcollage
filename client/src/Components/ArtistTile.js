import React from 'react';
import { LoadingDots } from './LoadingDots';

export function ArtistTile({ artist }) {
  let excerpt = '';
  let name = artist.name.replace(/\s\(\d+\)/ig, '');
  const strLength = 225;
  
  if (artist.profile) {
    const profile = artist.profile
      .replace(/\[\/*[bi]\]/g, '')
      .replace(/\[url=[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)\]/g, '')
      .replace(/\[\/url\]/g, '')
      .replace(/\[[al]=/g, '')
      .replace(/[[\]]/g, '')
      .replace(/\r\n\r\n/g, '\n');
    
    if (profile.length > strLength) {
      excerpt = profile.substring(0,strLength).replace(/[.(\r\n)]*\s+[\w\d]+(\r\n)*$/i, ' ');
    } else {
      excerpt = profile.replace(/(\r\n)*$/, ' ');
    }
  }
  
  return(
    <div className={artist.page === artist.pages && artist.page !== 0 ? "artistTile complete" : "artistTile"}>
      <div className="artistImgBox">
        <a href={artist.uri} target="_blank" rel="noreferrer">
          {artist.image ? <img className="artistImg" src={artist.image} alt={artist.name}></img> : <LoadingDots color="black" />}
        </a>
      </div>
      <div className="artistInfoBox">
        <p><strong>{name}</strong></p>
        {artist.uri ? <p className='excerpt'>{excerpt}<a href={artist.uri} target="_blank" rel="noreferrer">[...]</a></p> : null}
      </div>
    </div>
  )
}