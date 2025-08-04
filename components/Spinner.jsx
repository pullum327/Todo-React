// Spinner.jsx
import React from 'react';
import '../styles/spinner.css'; 

export default function Spinner() {
  return (
    <div className="spinner center">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="spinner-blade"></div>
      ))}
    </div>
  );
}
