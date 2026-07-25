import React from 'react'

export default function Card({
  children,
  onClick,
  className = '',
  selected = false
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-card p-5 transition-all duration-200
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${selected ? 'ring-2 ring-cyan shadow-lg' : 'shadow-sm hover:shadow-md'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
