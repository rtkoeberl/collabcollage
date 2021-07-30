import { ArtistTile } from '../ArtistTile/ArtistTile';
import { RunButton } from '../RunButton/RunButton';
import { SearchBar } from '../SearchBar/SearchBar';
import './SearchContainer.css';

export function SearchContainer({ state: {artists, runCompare}, onChange, onRun }) {
  return (
    <div id="searchBox">
      <SearchBar onChange={onChange} runCompare={runCompare} />
      <RunButton artists={artists} onRun={onRun} />
      {/* Toolbar... */}
      <div id="artistTiles">
        {artists.map(artist => <ArtistTile artist={artist} />)}
      </div>
    </div>
  )
}