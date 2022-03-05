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
    
    this.pauseBackup = this.pauseBackup.bind(this);
    this.saveArtist = this.saveArtist.bind(this);
    this.getArtistInfo = this.getArtistInfo.bind(this);
    this.getCredits = this.getCredits.bind(this);
    this.storeHistory = this.storeHistory.bind(this);
    this.toggleCompare = this.toggleCompare.bind(this);
    this.toggleOption = this.toggleOption.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.togglePopUp = this.togglePopUp.bind(this);
    this.highlightArtist = this.highlightArtist.bind(this);

    
    this.state = {
      artists: [],
      artistHistory: JSON.parse(ls.get('artistHistory')) || [],
      artistsToBackup: [],
      runCompare: false,
      hideComps: true,
      hideUnofficial: true,
      hideVarious: true,
      hideSidebar: false,
      showPopUp: ls.get('returnVisit') ? false : true,
      isIdle: true,
      highlighted: {
        name: null,
        id: null
      }
    }
    
    this.controller = null;
    this.idleTimeout = null;
  }

  // RUN BACKGROUND UPDATE - Check for artists that need Mongo backups updated and call API to update them while user is idle
  async componentDidUpdate(prevProps, prevState) {

    if (
      this.state.artistsToBackup !== prevState.artistsToBackup ||
      this.state.runCompare !== prevState.runCompare ||
      this.state.isIdle !== prevState.isIdle
    ) {

      // if comparison is not running
      if (this.state.runCompare === false && this.state.isIdle === true) { 
        if (this.state.artistsToBackup.length) {
          // console.log('User idle, artist backup to occur')
          let artistCopy = deepCopy(this.state.artistsToBackup[0]);

          if (artistCopy.page < artistCopy.pages) {

            try {
              const { data: newPage } = await axios.get(`/api/discog/${artistCopy.id}/releases/${artistCopy.page + 1}`);
              artistCopy.releases = artistCopy.releases.concat(formatRelease(newPage.releases, artistCopy.page));
              artistCopy.page++;
              let artistsToBackup = [...this.state.artistsToBackup];
              artistsToBackup[0] = artistCopy

              this.setState(prevState => {
                if (artistCopy.page === (prevState.artistsToBackup[0].page + 1)) {
                  return {
                    artistsToBackup: artistsToBackup
                  }
                }
              })
              // console.log(`page ${artistCopy.page} of ${artistCopy.pages} added to ${artistCopy.name}'s profile`)
            } catch (err) {
              if (err.name === 'AbortError') {
                console.log('Fetch aborted');
              } else {
                console.log('Uh oh, an error!', err);
              }
            }

          } else if (artistCopy.page === artistCopy.pages) {
            const backupInfo = {
              name: artistCopy.name,
              id: artistCopy.id,
              releases: artistCopy.releases,
              items: artistCopy.items,
            }

            axios.post(`/api/backup/${backupInfo.id}`, backupInfo);
            console.log(`${artistCopy.name} backup updated`);
            this.setState(prevState => {
              return {
                artistsToBackup: prevState.artistsToBackup.slice(1)
              }
            })
          }
        } 
      }
    }
  }

  // PAUSE BACKGROUND UPDATE - Set a timeout on background API calls to prioritize active user-initiated API calls
  pauseBackup() {
    clearTimeout(this.idleTimeout);
    if (!this.state.runCompare) {
      this.setState(prevState => {
        if (this.state.artistsToBackup.length && prevState.isIdle === true) {
          console.log('Artist backup paused')
        }
        return {
          isIdle: false
        }
      });
  
      this.idleTimeout = setTimeout(() => {
        this.setState({isIdle: true});
      }, (1000 * 10));
    }
  }
  
  // UPDATE ARTIST LIST - Update artists state with name/id from SearchBar, and call API to fill in additional info if needed
  saveArtist(valArr) {

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

  // GET ARTIST INFO - Call for artist info and first page of discography
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
        let today = new Date();
        let backupDate = new Date(backup[0].date);
        backupDate.setDate(backupDate.getDate() + 14);

        if (
          ( backup[0].items + 25 ) < discog.pagination.items &&
          backupDate <= today
        ) {
          console.log(`Backup for ${artist.name} to update`)
          const exists = this.state.artistsToBackup.map(a => a.id).indexOf(artist.id);
          if (exists === -1) {
            this.setState(prevState => {
              return {
                artistsToBackup: prevState.artistsToBackup.concat([deepCopy(artistInfo)])
              }
            })
          }
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
  
  // GET PAGE OF RELEASES - Call for another page of a given artist's credits
  async getCredits(id, page, i) {
    let { data: newPage } = await axios.get(`/api/discog/${id}/releases/${page}`)
    let newReleases = formatRelease(newPage.releases, page);
    
    let artists = deepCopy(this.state.artists);
    let index = artists.map(a => a.id).indexOf(id);
    if ( index > -1 && index === i ) {
      artists[i].releases = artists[i].releases.concat(newReleases);
      artists[i].page = newPage.pagination.page;

      this.setState({
        artists: artists
      });
    }
  }
  
  // STORE HISTORY LOCALLY - Preserve discographies of recently searched artists to local storage
  storeHistory() {
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

  // RUN COMPARISON - Handle starting/stopping comparison requests, updating local storage and mongo backups
  toggleCompare(boolean) {
    if (boolean === true) {
      if (this.state.runCompare === false) {
        this.setState({runCompare: true});
        console.log("We're running")
      } else {
        console.log('Comparison already in progress')
      }
    } else if ( boolean === false ){
      this.setState({ runCompare: false });
      console.log("We stopped running!")

       // If artists' discographies are fully loaded, update mongo backups and local storage
      if (this.state.artists.every(artist => artist.page === artist.pages)) {

        // Upload or update Mongo server copies of Discogs
        this.state.artists.forEach(artist => {
          if (artist.backupStatus === 'upload') {
            const body = {
              name: artist.name,
              id: artist.id,
              releases: artist.releases,
              items: artist.items
            }
            axios.post(`/api/backup`, body);
            console.log(`${artist.name} backup uploaded`)
            artist.backupStatus = null;
          }
        })

        // Store history locally
        this.storeHistory();
      }
      
    }
  }

  // HIGHLIGHT - Highlight a single artist within your search
  highlightArtist(artist, current) {
    if (artist === 'reset') {
      this.setState({highlighted: {
        name: null,
        id: null
      }})
    } else if (artist.id === current.id) {
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
  
  // OPTIONS - Toggle on and off search parameters related to release description
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
  
  // SIDEBAR - Toggle visibility of sidebar
  toggleSidebar(boolean) {
    if (boolean === true) {
      this.setState({hideSidebar: true});
    } else {
      this.setState({hideSidebar: false});
    }
  }
  
  // POP-UP - Toggle visibility of pop-up
  togglePopUp(boolean) {
    if (boolean === true) {
      this.setState({showPopUp: true});
    } else {
      this.setState({showPopUp: false});
    }
  }


  // 

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
          pauseBackup={this.pauseBackup}
        />
        <AlbumGrid
          state={this.state}
          onGetCredits={this.getCredits} 
          onReset={this.toggleCompare}
          pauseBackup={this.pauseBackup}
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