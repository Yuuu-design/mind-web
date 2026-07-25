import React, { useRef, useEffect, forwardRef } from 'react'

const InputBox = forwardRef(function InputBox({
  value,
  onChange,
  placeholder = '输入内容...',
  autoFocus = false,
  multiline = false,
  className = ''
}, externalRef) {
  const internalRef = useRef(null)

  useEffect(() => {
    if (autoFocus && internalRef.current) {
      internalRef.current.focus()
    }
  }, [autoFocus])

  // 暴露方法给父组件
  useEffect(() => {
    if (externalRef) {
      if (typeof externalRef === 'function') {
        externalRef(internalRef.current)
      } else {
        externalRef.current = internalRef.current
      }
    }
  }, [externalRef])

  const base = 'w-full bg-transparent outline-none text-base text-black placeholder:text-gray-400 resize-none'

  if (multiline) {
    return (
      <textarea
        ref={internalRef}
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
      ref={internalRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${base} py-2 ${className}`}
    />
  )
})

export default InputBox
