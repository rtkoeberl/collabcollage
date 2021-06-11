import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar'
import Discogs from '../../Util/Discogs'

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.search = this.search.bind(this);
    this.saveArtist = this.saveArtist.bind(this);
    this.getCredits = this.getCredits.bind(this);

    this.handleSelectArtist = this.handleSelectArtist.bind(this);
    
    this.typingTimer = null;
    this.state = {
      artists: [],
      credits: []
    }
  }

  search(artist) {
    return Discogs.search(artist)
      .then(res => {
        return res;
      });
  }

  saveArtist(valArr) {
    let artistArr = [];
    valArr.map(val => artistArr.push({
      name: val.label,
      id: val.value
    }))
    // valArr.forEach(val => {
    //   Discogs.getArtist(val.value)
    //   .then(res => artistArr.push(res))
    // })
    this.setState({
      artists: artistArr
    })
  }

  getCredits() {
    Discogs.getCredits(this.state.artists[0].id)
      .then(res => {
        console.log(res);
        this.setState({
          credits: res
        })
      })
  }

  handleSelectArtist(e) {
    console.log(e.target.value);
    this.setState({
      artist: {
        id: e.target.value
      }
    }, (async ()  => {
      const result = await this.saveArtist()
      console.log(result)
    }));
  }

  render() {
    return (
      <div className="App">
        <h1>CollabCollage</h1>
        <SearchBar onSearch={this.search} onChange={this.saveArtist} />
        <pre>Selected Value: {JSON.stringify(this.state.artists || {}, null, 2)}</pre>
        <button onClick={this.getCredits}>Get first artist's credits!</button>
        <pre>Selected Value: {JSON.stringify(this.state.credits || {}, null, 2)}</pre>
      </div>
    );
  }
}

export default App;
