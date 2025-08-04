// Spinner.jsx
import React from 'react';
import '../styles/spinner.css'; // 匯入 spinner 專屬樣式

export default function Spinner() {
  return (
    <div className="spinner center">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="spinner-blade"></div>
      ))}
    </div>
  );
}
