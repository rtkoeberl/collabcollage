import React from 'react';

export function AlbumTile ({ album }) {

  const albumInfo = () => {
    return `${album.title} by ${album.artist}`
  } 

  return (
    <div className="albumTile">
      <img className="albumCover" src={album.thumb} alt="cat" />
      <span className="albumInfo">{albumInfo()}</span>
    </div>
  )
}