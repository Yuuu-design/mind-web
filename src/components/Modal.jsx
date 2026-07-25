import React from 'react'

export default function Modal({ open, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-card p-6 w-full max-w-sm shadow-2xl animate-pop">
        {children}
      </div>
    </div>
  )
}
