import React from 'react';

export function ArtistTile({ artist }) {
  return(
    <div className={artist.page === artist.pages && artist.page !== 0 ? "artistTile complete" : "artistTile"}>
      <p><strong>{artist.name} (Artist #{artist.id})</strong></p>
      <p>Page {artist.page} / {artist.pages}</p>
      <p>Releases: {artist.releases ? artist.releases.length : 0} / {artist.items}</p>
    </div>
  )
}