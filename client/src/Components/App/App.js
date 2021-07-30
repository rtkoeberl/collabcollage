import React from 'react';
import axios from 'axios';
import './App.css';
import { formatRelease } from '../../Util'
import { SearchContainer } from '../SearchContainer/SearchContainer';
import { AlbumGrid } from '../AlbumGrid/AlbumGrid'

class App extends React.Component {
  constructor(props) {
    super(props);
  
    this.saveArtist = this.saveArtist.bind(this);
    this.getArtistInfo = this.getArtistInfo.bind(this);
    this.getCredits = this.getCredits.bind(this);
    this.toggleCompare = this.toggleCompare.bind(this);
    
    this.state = {
      artists: [],
      runCompare: false
    }
  }
  
  // Update artists state with name/id from SearchBar, and call API to fill in additional info if needed
  saveArtist(valArr)  {
    this.setState(prevState => {
      return {
        artists: valArr.map(({label, value}) => {
          let called = prevState.artists.map(a => a.id).indexOf(value);
          if (called > -1) {
            return prevState.artists[called];
          } else {
            this.getArtistInfo(value)
            return {
              name: label,
              id: value,
              page: 0,
              releases: []
            }
          }
        })
      }
    });
  }

  // Call for artist info and first page of discography
  async getArtistInfo(id)  {
    let artistCall = axios.get(`/api/discog/${id}`);
    let discogCall = axios.get(`/api/discog/${id}/releases`);
    let [{data: artist}, {data: discog}] = await axios.all([artistCall, discogCall]);

    let artistInfo = {
      name: artist.name,
      id: artist.id,
      profile: artist.profile,
      page: discog.pagination.page,
      pages: discog.pagination.pages,
      items: discog.pagination.items,
      releases: formatRelease(discog.releases, 1)
    }

    console.log(artistInfo);

    // check mongo backup for this artist's discog
    if (discog.pagination.pages >= 50) {
      let {data: backup} = await axios.get(`/api/backup/${id}`)
      if (typeof backup[0] === 'object') {
        if (
          backup[0].items !== discog.pagination.items &&
          new Date(backup[0].date).toLocaleDateString !== Date.now().toLocaleDateString
        ) {
          console.log(`Backup for ${artist.name} to update`)
          artistInfo.backupStatus = 'update';
        } else {
          console.log(`Backup for ${artist.name} retrieved`)
          artistInfo.page = discog.pagination.pages;
          artistInfo.releases = backup[0].releases;
        }
      } else {
        console.log(`Backup for ${artist.name} to upload`)
        artistInfo.backupStatus = 'upload';
      }
    }

    // LATER: add regex logic to trim profile blurb

    let artists = [...this.state.artists];
    let index = artists.map(a => a.id).indexOf(id);
    if (index > -1) {
      artists[index] = artistInfo;
      console.log(`Set state info for ${artistInfo.name}`);
      this.setState({
        artists: artists
      });
    } else {
      console.log(`Couldn't catch up with ${artistInfo.name}`)
    }
  }
  
  // Call for another page of an artist's credits
  async getCredits(id, page, i) {
    let { data: newPage } = await axios.get(`/api/discog/${id}/releases/${page}`)
    let newReleases = formatRelease(newPage.releases, page);
    
    let artists = [...this.state.artists];
    artists[i].releases = artists[i].releases.concat(newReleases);
    artists[i].page = newPage.pagination.page;

    this.setState({
      artists: artists
    });
    
  }

  // Handle starting/stopping comparison requests
  toggleCompare(boolean) {
    if (boolean === true) {
      if (this.state.runCompare === false) {
        this.setState({runCompare: true});
        // Minimize SearchBox
        console.log("We're running")
      } else {
        console.log('Comparison already in progress')
      }
    } else if ( boolean === false ){
      this.setState({ runCompare: false });
      console.log("We stopped running!")
    }
  }

  render() {
    return (
      <div className="App">
        <h1>CollabCollage</h1>
        <SearchContainer state={this.state} onChange={this.saveArtist} onRun={this.toggleCompare} />
        <AlbumGrid state={this.state} onGetCredits={this.getCredits} onReset={this.toggleCompare} />
      </div>
    );
  }
}

export default App;