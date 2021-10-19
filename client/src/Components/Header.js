import React, { useState } from 'react';

export function Header({ toggleSidebar, togglePopUp }) {
  const [sidebarHidden, hideSidebar] = useState(false);

  const handleToggle = () => {
    if (!sidebarHidden) {
      toggleSidebar(true);
      hideSidebar(true);
    } else {
      toggleSidebar(false);
      hideSidebar(false);
    }
  }

  return (
    <header>
      <button className="button button--h1" onClick={() => togglePopUp(true)}>
        <h1>CollabCollage</h1>
      </button>
      <button className="button button--nav" onClick={() => handleToggle()}>
        <p className="menuIcon">|||</p>
      </button>
    </header>
  )
}