import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-dropdown-select';
import { useDebounce } from '../../Util'

export function SearchBar({ onChange, runCompare, artistHistory, pauseBackup }) {
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
  const handleSearch = ({ props, state, methods }) => {
    
    pauseBackup();

    if (state.search) {
      setSearchTerm(state.search);
    }
    
    // match trimmed input
    const regexp = new RegExp(methods.safeString(state.search.trim()), 'i');
    const getByPath = (object, path) => {
      if (!path) {
        return;
      }
    
      return path.split('.').reduce((acc, value) => acc[value], object);
    };
    return methods
      .sortBy()
      .filter((item) =>
        regexp.test(getByPath(item, props.searchBy) || getByPath(item, props.valueField))
      );
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 1500)

  useEffect(
    () => {
      console.log(debouncedSearchTerm);
      if (debouncedSearchTerm) {
        onSearch(debouncedSearchTerm).then(res => {
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

  const onSearch = async (artist) => {
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
          pattern='/^\s+|\s+$/g'
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