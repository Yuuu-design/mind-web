import React from 'react'

const Icon = ({ name }) => {
  const icons = {
    inspiration: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.4 1 1 1 1.7V18h6v-1.6c0-.7.4-1.3 1-1.7A7 7 0 0 0 12 2z"/>
      </svg>
    ),
    plus: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    ),
    todo: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    )
  }
  return icons[name] || null
}

export default function BottomNav({ active, onChange }) {
  const items = [
    { key: 'inspiration', label: '灵感', icon: 'inspiration' },
    { key: 'plus', label: '＋', icon: 'plus' },
    { key: 'todo', label: '待办', icon: 'todo' }
  ]

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 pb-5 pt-2 z-40">
      <div className="flex items-center justify-around">
        {items.map(item => {
          const isActive = active === item.key
          const isPlus = item.key === 'plus'
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`
                flex flex-col items-center gap-1 min-w-[56px] transition-all duration-200
                ${isActive && !isPlus ? 'text-black' : 'text-gray-400'}
              `}
            >
              {isPlus ? (
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center -mt-5
                  transition-all duration-200 active:scale-90
                  ${isActive ? 'bg-pink text-white' : 'bg-cyan text-black shadow-md'}
                `}>
                  <Icon name={item.icon} />
                </div>
              ) : (
                <Icon name={item.icon} />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
