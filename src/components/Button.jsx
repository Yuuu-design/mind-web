import React from 'react'

export default function Button({
  children,
  onClick,
  variant = 'primary', // primary | accent | arrow | ghost | outline
  size = 'md', // sm | md | lg | icon
  disabled = false,
  className = ''
}) {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:pointer-events-none select-none'

  const variants = {
    // 主色 Cyan
    primary: 'bg-cyan text-black rounded-full shadow-sm',
    // 强调 Pink
    accent: 'bg-pink text-white rounded-full shadow-sm',
    // 箭头按钮 - 用 Cyan
    arrow: 'bg-cyan text-black rounded-full shadow-sm',
    // 幽灵
    ghost: 'bg-transparent text-black hover:bg-gray-100 rounded-full',
    // 描边
    outline: 'bg-white text-black border-2 border-black rounded-full',
    // 纯白底
    light: 'bg-white text-black rounded-full shadow-sm'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2',
    icon: 'w-12 h-12'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {variant === 'arrow' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      )}
      {children}
    </button>
  )
}
