import React from 'react';
import { ArtistTile } from './ArtistTile';
import { RunButton } from './RunButton';
import { SearchBar } from './SearchBar';
import { Toolbar } from './Toolbar';

export function SearchContainer({ state, onChange, onRun, onHide, toggleSidebar, highlightArtist }) {

  let {artists, artistHistory, runCompare, hideSidebar, highlighted} = state;
  
  return (
    <div className={`searchContainer ${hideSidebar ? 'hideSidebar--search' : ''}`}>
      <SearchBar onChange={onChange} runCompare={runCompare} artistHistory={artistHistory}/>
      <RunButton artists={artists} runCompare={runCompare} onRun={onRun} toggleSidebar={toggleSidebar} />
      <Toolbar state={state} onHide={onHide} />
      <div id="artistTiles">
        {artists.map(artist =>
          (<ArtistTile
            artist={artist} 
            key={artist.id} 
            length={artists.length}
            highlightArtist={highlightArtist}
            highlighted={highlighted}
          />)
        )}
      </div>
    </div>
  )
}