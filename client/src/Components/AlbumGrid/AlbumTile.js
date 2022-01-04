import axios from 'axios';
import React from 'react';
import { commaSeparate } from '../../Util';

export function AlbumTile ({ album }) {
  let artistFormatted;
  if (album.artist.length > 100) {
    artistFormatted = album.artist.slice(0,100) + '...';
  } else {
    artistFormatted = album.artist.replace(/\s\(\d+\)/ig, '');
  }

  const albumInfo = () => {
    const main = [], credits = [], prod = [], coprod = [], feat = [];
  
    album.collaborators.forEach(clb => {
      if (clb.roles.indexOf('Main') !== -1) {
        main.push(clb.artist)
      } else if (clb.roles.indexOf('Producer') !== -1) {
        prod.push(clb.artist)
      } else if (clb.roles.indexOf('Co-producer') !== -1) {
        coprod.push(clb.artist)
      } else {
        feat.push(clb.artist)
      }
    })

    let mainStr = main.length ? `is a release by ${commaSeparate(main)}` : '';
    prod.length && credits.push(`was produced by ${commaSeparate(prod)}`);
    coprod.length && credits.push(`${prod.length ? '' : 'was'} co-produced by ${commaSeparate(coprod)}`);
    feat.length && credits.push(`features ${commaSeparate(feat)}`);

    return `${mainStr}${mainStr && (credits.length) ? '. It ' : ''}${commaSeparate(credits)}`;
  }

  const getReleaseLink = async () => {
    const releaseId = album.id_r;
    let newWindow = window.open('', '_blank');

    const { data: releaseInfo } = await axios.get(`/api/discog/release/${releaseId}`);

    newWindow.location.href =releaseInfo.uri;
    
    if (newWindow) {
      newWindow.opener = null
    }
  }

  return (
    <div className="albumTile">
      <img className="albumCover" src={album.thumb} alt={album.title} />
      <div className="albumInfo">
        <div className="albumInfo_content">
          <p><strong>{`${album.title} by ${artistFormatted}${album.year ? ` (${album.year})` : ''}`}</strong> {albumInfo()}</p>
          <div className="link-btn">
            <p onClick={() => getReleaseLink()}>View on<br />Discogs</p>
          </div>
        </div>
      </div>
    </div>
  )
}