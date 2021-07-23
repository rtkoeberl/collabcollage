import React from 'react';

export function AlbumTile (album) {
  const renderAlbumDetails = () => {
    return `${album.title} by ${album.artist}`
  }

  return (
    <div>
      <img className="albumCover" src={album.thumb} alt={album.title}/>
      <div className="infoBar">{renderAlbumDetails}</div>
    </div>
  )
}