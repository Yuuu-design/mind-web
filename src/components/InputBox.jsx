import React, { useRef, useEffect } from 'react'

export default function InputBox({
  value,
  onChange,
  placeholder = '输入内容...',
  autoFocus = false,
  multiline = false,
  className = ''
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus()
    }
  }, [autoFocus])

  const base = 'w-full bg-transparent outline-none text-base text-black placeholder:text-gray-400 resize-none'

  if (multiline) {
    return (
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={`${base} leading-relaxed ${className}`}
      />
    )
  }

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${base} py-2 ${className}`}
    />
  )
}
