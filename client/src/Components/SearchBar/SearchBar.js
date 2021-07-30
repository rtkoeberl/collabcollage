import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-dropdown-select';
import { useDebounce } from '../../Util'
import './SearchBar.css';

// TO DO
// https://sanusart.github.io/react-dropdown-select/prop/no-data-renderer
// Change color of every artist past 2... although might not be a prob if i can compare more than two!

export function SearchBar({ onChange, runCompare }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [artistLimit, setArtistLimit] = useState(false);

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
    if (!runCompare) {
      onChange(valArr.slice(0,5));
      setArtistLimit(valArr.length > 5 ? true : false);
    } else {
      // send an alert!
    } 
  }

  return (
    <div className="SearchBar">
      <p id="lengthWarning" className={artistLimit ? '' : 'hidden'}>Too many artists, please delete one!</p>
      <Select
        multi
        options={searchResults}
        searchFn={handleSearch}
        onChange={value => handleChange(value)}
      />
    </div>
  )
}