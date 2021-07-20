import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-dropdown-select';
import { useDebounce } from '../../Util'
import './SearchBar.css';

// TO DO
// https://sanusart.github.io/react-dropdown-select/prop/no-data-renderer

export function SearchBar({ onChange, onRun, running }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [artistLimit, setArtistLimit] = useState(false);
  const [canSearch, setCanSearch] = useState(false);

  // Search for artist
  const handleSearch = (value) => {
    setSearchTerm(value.state.search)
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 1500)

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        // setIsSearching(true);
        onSearch(debouncedSearchTerm).then(res => {
          console.log(res);
          // setIsSearching(false);
          setSearchResults(res.results.map(result => ({
            label: result.title,
            value: result.id
          })));
        });
      } else {
        setSearchResults([]);
      }
    },
    [debouncedSearchTerm]
  )

  const onSearch = (artist) => {
    return axios.get(`/api/discog/search/${encodeURIComponent(artist)}`)
      .then(res => res.data)
      .catch((error) => console.log(error))
  }

  // Update artist information

  const handleChange = (valArr) => {
    if (!running) {
      onChange(valArr.slice(0,2));
      setCanSearch(valArr.length > 1 ? true : false);
      setArtistLimit(valArr.length > 2 ? true : false);
    } else {
      // send an alert!
    } 
  }

  const handleRun = (value) => {
    onRun(value);
  }

  return(
    <div className="SearchBar">
      <p id="lengthWarning" className={artistLimit ? '' : 'hidden'}>Too many artists, please delete one!</p>
      <Select
        multi
        options={searchResults}
        searchFn={handleSearch}
        onChange={value => handleChange(value)}
      />
      <button onClick={() => handleRun(true)} disabled={!canSearch}>Generate Discog</button>
    </div>
  )
}