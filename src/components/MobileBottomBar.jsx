import React from 'react';
import { Search } from 'lucide-react';

export function MobileBottomBar({ onFindDoctor }) {
  return (
    <div className="mobile-bottom-bar">
      <button
        className="btn btn-primary btn-full btn-lg"
        onClick={onFindDoctor}
        id="mobile-sticky-find-doctor-btn"
      >
        <Search size={18} /> Find a Doctor
      </button>
    </div>
  );
}
