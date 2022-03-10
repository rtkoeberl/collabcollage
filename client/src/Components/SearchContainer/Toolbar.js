import React from 'react';

export function Toolbar ({ state: {artists, hideComps, hideUnofficial, hideVarious, searchAll}, onHide }) {
  const handleHide = (option, boolean) => {
    onHide(option, !boolean)
  }

  let length = artists.length;

  const searchAllOption = (
    <div>
      <input type="checkbox" id="searchAll" name="searchAll"
        defaultChecked={searchAll} onChange={() => handleHide("all", searchAll)} />
      <label htmlFor="searchAll">Limit Results to Releases Containing All {length} Artists</label>
    </div>
  )

  return (
    <details id="toolbar">
      <summary>Options</summary>
      <div>
        <input type="checkbox" id="hideComps" name="hideComps"
          defaultChecked={hideComps} onChange={() => handleHide("comps", hideComps)} />
        <label htmlFor="hideComps">Hide Compilations</label>
      </div>
      <div>
        <input type="checkbox" id="hideUnofficial" name="hideUnofficial"
          defaultChecked={hideUnofficial} onChange={() => handleHide("unoff", hideUnofficial)} />
        <label htmlFor="hideUnofficial">Hide Unofficial Releases</label>
      </div>
      <div>
        <input type="checkbox" id="hideVarious" name="hideVarious"
          defaultChecked={hideVarious} onChange={() => handleHide("various", hideVarious)} />
        <label htmlFor="hideVarious">Hide Releases by "Various" or "Unknown"</label>
      </div>
      {length > 2 ? searchAllOption : ''}
    </details>
  )
}