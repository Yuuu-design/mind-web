import React from 'react'

export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center text-black active:scale-95 transition-transform"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>
  )
}
