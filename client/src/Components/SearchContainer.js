import React from 'react';
import { ArtistTile } from './ArtistTile';
import { RunButton } from './RunButton';
import { SearchBar } from './SearchBar';
import { Toolbar } from './Toolbar';

export function SearchContainer({ state: {artists, runCompare, hideComps, hideUnofficial, hideSidebar}, onChange, onRun, onHide, toggleSidebar }) {
  return (
    <div className={`searchContainer ${hideSidebar ? 'hideSidebar--search' : ''}`}>
      <SearchBar onChange={onChange} runCompare={runCompare} />
      <RunButton artists={artists} runCompare={runCompare} onRun={onRun} toggleSidebar={toggleSidebar} />
      <Toolbar hideComps={hideComps} hideUnofficial={hideUnofficial} onHide={onHide} />
      <div id="artistTiles">
        {artists.map(artist => <ArtistTile artist={artist} key={artist.id}/>)}
      </div>
    </div>
  )
}