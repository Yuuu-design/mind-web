import React from 'react'

const Icon = ({ name, size = 22 }) => {
  const icons = {
    inspiration: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.4 1 1 1 1.7V18h6v-1.6c0-.7.4-1.3 1-1.7A7 7 0 0 0 12 2z"/>
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    ),
    todo: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    )
  }
  return icons[name] || null
}

export default function BottomNav({ active, onChange }) {
  const items = [
    { key: 'inspiration', icon: 'inspiration' },
    { key: 'plus', icon: 'plus' },
    { key: 'todo', icon: 'todo' }
  ]

  return (
    <div className="absolute bottom-4 left-6 right-6 z-40">
      <div className="bg-white rounded-2xl shadow-lg px-4 py-3">
        <div className="flex items-center justify-between">
          {items.map(item => {
            const isActive = active === item.key
            const isPlus = item.key === 'plus'
            return (
              <button
                key={item.key}
                onClick={() => onChange(item.key)}
                className={`
                  flex items-center justify-center transition-all duration-200
                  ${isActive && !isPlus ? 'text-black' : 'text-gray-400'}
                `}
              >
                {isPlus ? (
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-200 active:scale-90
                    ${isActive ? 'bg-pink text-white' : 'bg-cyan text-black shadow-md'}
                  `}>
                    <Icon name={item.icon} size={24} />
                  </div>
                ) : (
                  <Icon name={item.icon} size={26} />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
