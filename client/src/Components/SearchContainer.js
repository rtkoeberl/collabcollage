import React from 'react';
import { ArtistTile } from './ArtistTile';
import { RunButton } from './RunButton';
import { SearchBar } from './SearchBar';

export function SearchContainer({ state: {artists, runCompare}, onChange, onRun }) {
  return (
    <div id="searchContainer">
      <SearchBar onChange={onChange} runCompare={runCompare} />
      <RunButton artists={artists} onRun={onRun} />
      {/* Toolbar... */}
      <div id="artistTiles">
        {artists.map(artist => <ArtistTile artist={artist} key={artist.id}/>)}
      </div>
    </div>
  )
}