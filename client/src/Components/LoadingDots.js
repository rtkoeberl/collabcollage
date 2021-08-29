import React from 'react';

export function LoadingDots ({ color }) {
  return (
    <div className="loading-dots">
      <div className={`loading-dots--dot loading-dots--${color}`}></div>
      <div className={`loading-dots--dot loading-dots--${color}`}></div>
      <div className={`loading-dots--dot loading-dots--${color}`}></div>
    </div>
  )
}