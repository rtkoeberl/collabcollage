import React from 'react';
import axios from 'axios';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar'

class App extends React.Component {
  constructor(props) {
    super(props);
  
    this.saveArtist = this.saveArtist.bind(this);
    this.getCredits = this.getCredits.bind(this);
    
    this.state = {
      artists: [],
      years: [],
      credits: []
    }
  }

  async saveArtist(valArr)  {
    // Theoretically place logic for loading stuff here
    let artistArr = await Promise.all(valArr.map(async (val) => {
      let called = this.state.artists.map(a => a.id).indexOf(val.value);
      if (called > -1) {
        return this.state.artists[called];
      } else {
        let call1 = axios.get(`/api/discog/${val.value}`);
        let call2 = axios.get(`/api/discog/${val.value}/releases`);
        let [artist, discog] = await Promise.all([call1, call2]);
        console.log(discog)

        // import regex logic for profile
        return {
          name: artist.data.name,
          id: artist.data.id,
          profile: artist.data.profile,
          page: discog.data.pagination.page,
          pages: discog.data.pagination.pages,
          releases: discog.data.releases
        }
      }
    }));
    
    console.log(artistArr);
    this.setState({
      artists: artistArr
    });
  }

  getCredits() {
    axios.get(`/api/discog/${this.state.artists[0].id}/releases`)
      .then(res => {
        console.log(res.data);
        this.setState({
          credits: res.data.releases
        });
      })
  }

  render() {
    return (
      <div className="App">
        <h1>CollabCollage</h1>
        <SearchBar onChange={this.saveArtist} />
        <div className="sidebyside">
          <pre>Selected Value: {JSON.stringify(this.state.artists[0] || {}, null, 2)}</pre>
          <pre>Selected Value: {JSON.stringify(this.state.artists[1] || {}, null, 2)}</pre>
        </div>
        <button onClick={this.getCredits}>Get first artist's credits!</button>
        <pre>Selected Value: <ul>
        {this.state.credits.map((release, i) => <li key={i}>{release.title}</li>)}

          </ul></pre>
      </div>
    );
  }
}

export default App;
