import React from 'react';
import { ArtistMap } from './ArtistMap';
import { RunButton } from './RunButton';
import { SearchBar } from './SearchBar';
import { Toolbar } from './Toolbar';

export function SearchContainer({ state, onChange, onRun, onHide, toggleSidebar, highlightArtist, pauseBackup }) {
  let {artists, artistHistory, runCompare, hideSidebar, highlighted} = state;

  return (
    <div className={`searchContainer ${hideSidebar ? 'hideSidebar--search' : ''}`}>
      <SearchBar onChange={onChange} runCompare={runCompare} artistHistory={artistHistory} pauseBackup={pauseBackup} />
      <RunButton artists={artists} runCompare={runCompare} onRun={onRun} toggleSidebar={toggleSidebar} pauseBackup={pauseBackup} />
      <Toolbar state={state} onHide={onHide} />
      <ArtistMap artists={artists} highlighted={highlighted} highlightArtist={highlightArtist} />
    </div>
  )
}