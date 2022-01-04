import React from 'react';
import axios from 'axios';
import ls from 'local-storage';
import '../Sass/app.scss'
import { formatRelease, deepCopy } from '../Util';
import { SearchContainer } from './SearchContainer/SearchContainer';
import { AlbumGrid } from './AlbumGrid/AlbumGrid';
import { Header } from './Header';
import { PopUp } from './PopUp';
import placeholder from '../Images/placeholder.jpeg';

class App extends React.Component {
  constructor(props) {
    super(props);
  
    this.saveArtist = this.saveArtist.bind(this);
    this.getArtistInfo = this.getArtistInfo.bind(this);
    this.getCredits = this.getCredits.bind(this);
    this.updateBackup = this.updateBackup.bind(this);
    this.backupData = this.backupData.bind(this);
    this.storeHistory = this.storeHistory.bind(this);
    this.toggleCompare = this.toggleCompare.bind(this);
    this.toggleOption = this.toggleOption.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.togglePopUp = this.togglePopUp.bind(this);
    this.highlightArtist = this.highlightArtist.bind(this);
    
    this.state = {
      artists: [],
      artistHistory: JSON.parse(ls.get('artistHistory')) || [],
      runCompare: false,
      hideComps: true,
      hideUnofficial: true,
      hideVarious: true,
      hideSidebar: false,
      showPopUp: ls.get('returnVisit') ? false : true,
      highlighted: {
        name: null,
        id: null
      }
    }
  }
  
  // Update artists state with name/id from SearchBar, and call API to fill in additional info if needed
  saveArtist(valArr)  {
    if (this.state.highlighted.id && valArr.map(a => a.value).indexOf(this.state.highlighted.id) === -1) {
      console.log('The highlighted artist has been deleted!')
      this.setState({
        highlighted: {
          name: null,
          id: null
        }
      })
    }

    this.setState(prevState => {
      return {
        artists: valArr.map(({label, value}) => {
          const called = prevState.artists.map(a => a.id).indexOf(value);
          const exists = this.state.artistHistory.map(a => a.id).indexOf(value);
    
          if (called !== -1) {
            return prevState.artists[called];
          } else if (exists !== -1) {
            console.log(this.state.artistHistory[exists])
            return this.state.artistHistory[exists];
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
      uri: artist.uri,
      image: artist.images ? artist.images[0].uri : placeholder,
      page: discog.pagination.page,
      pages: discog.pagination.pages,
      items: discog.pagination.items,
      releases: formatRelease(discog.releases, 1)
    }
    // console.log(artistInfo);

    // check mongo backup for this artist's discog
    if (discog.pagination.pages >= 45) {
      let {data: backup} = await axios.get(`/api/backup/${id}`)
      if (typeof backup[0] === 'object') {
        if (
          ( backup[0].items + 15 ) < discog.pagination.items &&
          new Date(backup[0].date).toLocaleDateString !== Date.now().toLocaleDateString
        ) {
          console.log(`Backup for ${artist.name} to update`)
          artistInfo.backupStatus = 'update';
        } else {
          console.log(`Backup for ${artist.name} retrieved`)
        }
        artistInfo.page = discog.pagination.pages;
        artistInfo.releases = backup[0].releases;
      } else {
        console.log(`Backup for ${artist.name} to upload`)
        artistInfo.backupStatus = 'upload';
      }
    }

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
  
  // Call for another page of a given artist's credits
  async getCredits(id, page, i) {
    let { data: newPage } = await axios.get(`/api/discog/${id}/releases/${page}`)
    let newReleases = formatRelease(newPage.releases, page);
    
    let artists = [...this.state.artists];
    let index = artists.map(a => a.id).indexOf(id);
    if (index > -1) {
      artists[i].releases = artists[i].releases.concat(newReleases);
      artists[i].page = newPage.pagination.page;

      this.setState({
        artists: artists
      });
    }
  }

  storeHistory() {

    // Deep copy the current artist history
    const artistHistory = deepCopy(this.state.artistHistory);
    this.state.artists.forEach(artist => {
      const exists = artistHistory.map(a => a.id).indexOf(artist.id);
      if (exists !== -1) {
        console.log(`Updating ${artist.name} in local history`)
        let removed = artistHistory.splice(exists, 1);
        artistHistory.unshift(removed[0]);
      } else {
        if (artist.pages > 1) {
          console.log(`Storing ${artist.name} to local history`)
          artistHistory.unshift(deepCopy(artist));
        }
      }
    })

    // Save last fifteen aftists to state AND local storage
    const newArtistHistory = artistHistory.slice(0, 15);

    this.setState({
      artistHistory: newArtistHistory
    })

    ls.remove('artistHistory');
    ls.set('artistHistory', JSON.stringify(newArtistHistory));

  }
  
  // After comparison is run, retrieve new copy of artist discography to be updated, which is interrupted if a new search is run.
  async updateBackup(artist) {

    const pages = artist.pages;
    const backupInfo = {
      name: artist.name,
      id: artist.id,
      releases: [],
      items: artist.items,

    }
    let i = 1;

    while (i <= pages && this.state.runCompare === false) {
      let { data: newPage } = await axios.get(`/api/discog/${artist.id}/releases/${i}`);
      let newReleases = formatRelease(newPage.releases, i);
      backupInfo.releases.push(newReleases);
      console.log(`Backup page ${i} retrieved`)
      i++;
    }

    if ( i === (pages + 1) ) {
      axios.post(`/api/backup/${artist.id}`, backupInfo);
      console.log(`${artist.name} backup updated`)
    } else {
      console.log(`${artist.name} backup update failed`)
    }
  }
  
  // Handle artists whose discographies must be updated or uploaded
  backupData(artist) {
    
    if (artist.backupStatus === 'upload') {

      const body = {
        name: artist.name,
        id: artist.id,
        releases: artist.releases,
        items: artist.items
      }
      axios.post(`/api/backup`, body);
      console.log(`${artist.name} backup uploaded`)

    } else if (artist.backupStatus === 'update') {

      this.updateBackup(artist);

    }

    artist.backupStatus = null;
  }

  // Handle starting/stopping comparison requests, update local storage and mongo backups
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

       // If artists' discographies are fully loaded, update mongo backups and local storage
      if (this.state.artists.every(artist => artist.page === artist.pages)) {

        // Store history locally
        this.storeHistory();

        // Upload or update Mongo server copies of Discogs
        this.state.artists.forEach(artist => {
          this.backupData(artist);
        })
      }
      
    }
  }

  // Highlight artist
  highlightArtist(artist, current) {
    if (artist.id === current.id) {
      this.setState({highlighted: {
        name: null,
        id: null
      }})
    } else {
      this.setState({highlighted: {
        name: artist.name,
        id: artist.id
      }})
    }
  }

  toggleOption(option, boolean) {
    if (option === "comps") {
      if (boolean === true && this.state.hideComps === false) {
        this.setState({hideComps: true});
      } else if ( boolean === false && this.state.hideComps === true){
        this.setState({hideComps: false});
      }
    }

    if (option === "unoff") {
      if (boolean === true && this.state.hideUnofficial === false) {
        this.setState({hideUnofficial: true});
      } else if ( boolean === false && this.state.hideUnofficial === true){
        this.setState({hideUnofficial: false});
      }
    }

    if (option === "various") {
      if (boolean === true && this.state.hideVarious === false) {
        this.setState({hideVarious: true});
      } else if ( boolean === false && this.state.hideVarious === true){
        this.setState({hideVarious: false});
      }
    }
  }

  toggleSidebar(boolean) {
    if (boolean === true) {
      this.setState({hideSidebar: true});
    } else {
      this.setState({hideSidebar: false});
    }
  }

  togglePopUp(boolean) {
    if (boolean === true) {
      this.setState({showPopUp: true});
    } else {
      this.setState({showPopUp: false});
    }
  }

  render() {
    return (
      <div className="App">
        <Header
          toggleSidebar={this.toggleSidebar}
          togglePopUp={this.togglePopUp}
        />
        <SearchContainer
          state={this.state}
          onChange={this.saveArtist}
          onRun={this.toggleCompare}
          onHide={this.toggleOption}
          toggleSidebar={this.toggleSidebar}
          highlightArtist={this.highlightArtist}
        />
        <AlbumGrid
          state={this.state}
          onGetCredits={this.getCredits} 
          onReset={this.toggleCompare} 
        />
        <PopUp
          showPopUp={this.state.showPopUp}
          togglePopUp={this.togglePopUp}
        />
      </div>
    );
  }
}

export default App;