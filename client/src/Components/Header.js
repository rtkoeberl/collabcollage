import React, { useState } from 'react';

export function Header({ toggleSidebar }) {
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
      <h1>CollabCollage</h1>
      <button onClick={() => handleToggle()}>
        <p className="menuIcon">|||</p>
      </button>
    </header>
  )
}