import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-dropdown-select';
import { useDebounce } from '../../Util'

// TO DO
// https://sanusart.github.io/react-dropdown-select/prop/no-data-renderer
// Change color of every artist past 2... although might not be a prob if i can compare more than two!

export function SearchBar({ onChange, runCompare, artistHistory, clearArtists, deleteArtists }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [historyFormatted, setHistoryFormatted] = useState([]);

  useEffect(
    () => {
      setHistoryFormatted(artistHistory.map(a => ({
        label: a.name,
        value: a.id
      })))
    },
    [artistHistory]
  )

  // Search for artist
  const handleSearch = (value) => {
    if (value) {
      setSearchTerm(value.state.search)
    }
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
      onChange(valArr);
    }
  }

  return (
    <div id="search">
      <div id="searchBar">
        <Select
          multi
          options={searchResults.length ? searchResults : historyFormatted}
          searchFn={handleSearch}
          onChange={value => handleChange(value)}
          disabled={runCompare}
          placeholder="Search for artists here..."
          closeOnSelect='true'
          clearable='true'
        />
      </div>   
    </div>
  )
}