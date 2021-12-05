import React from 'react';

export function Toolbar ({ state: {hideComps, hideUnofficial, hideVarious}, onHide }) {
  const handleHide = (option, boolean) => {
    onHide(option, !boolean)
  }

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
    </details>
  )
}