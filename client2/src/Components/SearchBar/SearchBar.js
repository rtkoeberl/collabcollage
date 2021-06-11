import React, { useState, useEffect } from 'react';
import Select from 'react-dropdown-select';
import useDebounce from '../../Util/debounce'
import './SearchBar.css';

// TO DO
// https://sanusart.github.io/react-dropdown-select/prop/no-data-renderer

export function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 1250)

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        props.onSearch(debouncedSearchTerm).then(res => {
          setIsSearching(false);
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

  const onSearch = (value) => {
    setSearchTerm(value.state.search)
  }


  const onChange = (valArr) => {
    if (valArr.length > 2) {
      console.log('Too many artists, please delete one!')
      return props.onChange(valArr.slice(0,2))
    } else {
      return props.onChange(valArr)
    }
  }

  return(
    <div className="SearchBar">
      <Select
        multi
        options={searchResults}
        searchFn={onSearch}
        onChange={value => onChange(value)}
      />
    </div>
  )
}

// handleTermChange(e) {
//   if (e.target.value !== this.state.term) {
//     clearTimeout(this.typingTimer);
//   }
//   if (e.target.value) {
//     if (!this.state.loadingAni) {
//       console.log("Timer set!")
//       this.setState({loadingAni: true});
//     }
//     this.typingTimer = setTimeout(() => this.search(), 1500)
//   } else {
//     console.log("Timer ended!");
//     this.setState({loadingAni: false});
//   }
//   this.setState({term: e.target.value});
//   console.log(e.target.value);
// }