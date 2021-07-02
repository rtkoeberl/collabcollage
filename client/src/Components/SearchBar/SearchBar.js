import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-dropdown-select';
import useDebounce from '../../Util/debounce'
import './SearchBar.css';

// TO DO
// https://sanusart.github.io/react-dropdown-select/prop/no-data-renderer

export function SearchBar({ onChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [artistLimit, setArtistLimit] = useState(false);
  // const [isSearching, setIsSearching] = useState(false);

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
  );

  const onSearch = (artist) => {
    return axios.get(`/api/discog/search/${encodeURIComponent(artist)}`)
      .then(res => res.data)
      .catch((error) => console.log(error))
  }

  const handleSearch = (value) => {
    setSearchTerm(value.state.search)
  }

  const handleChange = (valArr) => {
    if (valArr.length > 2) {
      setArtistLimit(true);
      onChange(valArr.slice(0,2))
    } else {
      setArtistLimit(false);
      onChange(valArr)
    }
  }

  return(
    <div className="SearchBar">
      <Select
        multi
        options={searchResults}
        searchFn={handleSearch}
        onChange={value => handleChange(value)}
      />
      <p id="lengthWarning" className={artistLimit ? '' : 'hidden'}>Too many artists, please delete one!</p>
    </div>
  )
}