import React from 'react';

export function Toolbar ({ hideComps, hideUnofficial, onHide }) {
  const handleHide = (option) => {
    onHide(option, option === "comps" ? !hideComps : !hideUnofficial)
  }

  return (
    <details id="toolbar">
      <summary>Options</summary>
      <div>
        <input type="checkbox" id="hideComps" name="hideComps"
          defaultChecked={hideComps} onChange={() => handleHide("comps")} />
        <label for="hideComps">Hide Compilations</label>
      </div>
      <div>
        <input type="checkbox" id="hideUnofficial" name="hideUnofficial"
          defaultChecked={hideUnofficial} onChange={() => handleHide("unoff")} />
        <label for="hideUnofficial">Hide Unofficial Releases</label>
      </div>
    </details>
  )
}