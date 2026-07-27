import React, { useState, useRef, useEffect } from 'react'
import Button from '../components/Button'
import InlineInput from '../components/InlineInput'

const promptTexts = [
  '今天有什么灵感迸发？',
  '此刻在想什么？',
  '有什么新奇的想法？',
  '脑海中出现什么画面？',
  '今天发现了什么有趣的事？',
  '有什么想要记录下来的？',
  '灵感来了就抓住它',
  '让想法自由流动',
  '每一个碎片都有意义',
  '今天想探索什么？',
  '有什么创意想要分享？',
  '记录下此刻的心情',
  '今天有什么新的发现？',
  '想要写下什么故事？',
  '让创意在此刻绽放',
]

export default function Welcome({ onAddInspiration, onGoUrgent, onGoHome, fromInspiration = false }) {
  const [value, setValue] = useState('')
  const [photos, setPhotos] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [promptText, setPromptText] = useState(promptTexts[Math.floor(Math.random() * promptTexts.length)])
  const menuRef = useRef(null)
  const inputAreaRef = useRef(null)
  const textareaRef = useRef(null)

  // 点击空白处关闭菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  // 点击空白区域返回首页
  const handleBackgroundClick = (e) => {
    // 如果点击的是输入区、按钮或菜单，不处理
    if (inputAreaRef.current?.contains(e.target)) return
    if (menuRef.current?.contains(e.target)) return
    // 有内容时不返回，避免误触
    if (value.trim() || photos.length > 0) return
    onGoHome()
  }
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const audioInputRef = useRef(null)
  const hasInput = value.trim().length > 0 || photos.length > 0

  // 处理文件选择（相册）
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          setPhotos(prev => [...prev, {
            id: Date.now() + Math.random(),
            data: ev.target.result,
            name: file.name,
            type: 'image'
          }])
        }
        reader.readAsDataURL(file)
      }
    })
    e.target.value = ''
    setShowMenu(false)
  }

  // 处理拍照
  const handleCameraCapture = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          data: ev.target.result,
          name: '拍照_' + Date.now(),
          type: 'camera'
        }])
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
    setShowMenu(false)
  }

  // 处理视频
  const handleVideoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          data: ev.target.result,
          name: file.name,
          type: 'video'
        }])
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
    setShowMenu(false)
  }

  // 处理音频
  const handleAudioSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          data: ev.target.result,
          name: file.name,
          type: 'audio'
        }])
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
    setShowMenu(false)
  }

  // 删除已选文件
  const handleRemovePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  // 当有新照片时，插入到输入框中
  useEffect(() => {
    if (photos.length > 0 && textareaRef.current) {
      const lastPhoto = photos[photos.length - 1]
      textareaRef.current.insertMedia(lastPhoto)
    }
  }, [photos.length])

  const handleSubmit = () => {
    if (!hasInput) return
    onAddInspiration(value.trim(), '', photos)
    setPhotos([])
    setValue('')
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      // 从灵感页面进入时停留，从首页进入时跳转到待办页
      if (!fromInspiration) {
        onGoUrgent()
      }
    }, 500)
  }

  // 功能菜单项
  const menuItems = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      ),
      label: '拍摄照片',
      color: 'bg-pink',
      onClick: () => cameraInputRef.current?.click()
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      ),
      label: '从相册选择',
      color: 'bg-cyan',
      onClick: () => fileInputRef.current?.click()
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      ),
      label: '视频',
      color: 'bg-black',
      onClick: () => videoInputRef.current?.click()
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      ),
      label: '音频',
      color: 'bg-cyan',
      onClick: () => audioInputRef.current?.click()
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h2M12 2v2M12 20v2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
      ),
      label: '扫描文字',
      color: 'bg-pink',
      onClick: () => {
        setShowMenu(false)
        alert('扫描文字功能在完整版中启用')
      }
    }
  ]

  // 插入当前时间
  const handleInsertTime = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const timeStr = `【${hours}：${minutes}】`
    const newValue = value ? `${value}\n${timeStr}\n` : `${timeStr}\n`
    setValue(newValue)
    // 插入后聚焦并移动光标到末尾
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        const len = newValue.length
        textareaRef.current.setSelectionRange(len, len)
      }
    }, 0)
  }

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-8 animate-fade-in">
      {/* 顶部 */}
      <div className="relative mb-10">
        <button
          onClick={() => {
            if (value.trim() || photos.length > 0) {
              setShowExitConfirm(true)
            } else {
              onGoHome()
            }
          }}
          className="absolute -top-4 -left-1 w-10 h-10 flex items-center justify-center text-black active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="pt-8">
          <h1 className="text-3xl font-bold text-black leading-tight">
            Hey，Rainey
          </h1>
          <p className="text-xl text-gray-500 mt-2 leading-snug">
            {promptText}
          </p>
        </div>
      </div>

      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            灵感记录成功
          </div>
        </div>
      )}

      {/* 中间输入区 */}
      <div className="flex-1 flex flex-col">
        <div ref={inputAreaRef} className="bg-white rounded-card p-5 shadow-sm flex-1 min-h-[200px] relative">
          <InlineInput
            ref={textareaRef}
            value={value}
            onChange={setValue}
            placeholder="想到什么，随手记下来..."
            photos={photos}
            onRemovePhoto={handleRemovePhoto}
            className="h-full"
          />

          {/* 底部工具栏 - 卡片内 */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            {/* 左侧：加号 + 时钟 */}
            <div className="flex items-center gap-2">
              {/* 加号按钮 */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    showMenu ? 'bg-black text-white rotate-45' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>

                {/* 功能菜单弹出 */}
                {showMenu && (
                  <div ref={menuRef} className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-xl p-2 w-44 animate-pop z-50">
                    {menuItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={item.onClick}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                        <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center text-white`}>
                          {item.icon}
                        </div>
                        <span className="text-sm text-black font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 时钟按钮 */}
              <button
                onClick={handleInsertTime}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all"
                title="插入时间"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </button>
            </div>

            {/* 右侧：箭头（无输入时） */}
            {!hasInput && (
              <Button variant="arrow" size="icon" onClick={onGoUrgent} />
            )}
          </div>

          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className="hidden"
          />
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* 底部按钮（有输入时显示提交） */}
      {hasInput && (
        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={handleSubmit}
            className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center active:scale-95 transition-transform shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </button>
        </div>
      )}

      {/* 退出确认弹窗 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
          <div className="relative bg-white rounded-card p-6 w-full max-w-sm shadow-2xl animate-pop">
            <p className="text-base text-black text-center mb-3">您编辑的内容将不会被<br />保存，真的要退出么？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600"
              >
                继续编辑
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false)
                  onGoHome()
                }}
                className="flex-1 py-2.5 rounded-full bg-pink text-white text-sm font-medium"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
