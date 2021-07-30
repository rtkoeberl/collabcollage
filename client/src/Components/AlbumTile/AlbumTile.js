import React from 'react';

export function AlbumTile ({ album, onGetInfo }) {

  const albumInfo = (record) => {
    /* if (hover && !album.key-that-only-api-called-albums-have) {
      onGetInfo(album.id)
    } */
    return `<strong>${record.title}</strong> by ${record.artist}`
  }

  return (
    <div>
      <img className="albumCover" width="200px" height="200px" src={album.thumb} alt="cat" />
      <div className="albumInfo" dangerouslySetInnerHTML={{__html: albumInfo(album)}}></div>
    </div>
  )
}