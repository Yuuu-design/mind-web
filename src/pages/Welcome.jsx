import React, { useState, useRef, useEffect } from 'react'
import Button from '../components/Button'
import InputBox from '../components/InputBox'

export default function Welcome({ onAddInspiration, onGoUrgent }) {
  const [value, setValue] = useState('')
  const [photos, setPhotos] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

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

  const handleSubmit = () => {
    if (!hasInput) return
    onAddInspiration(value.trim(), '', photos)
    setPhotos([])
    setValue('')
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

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-8 animate-fade-in">
      {/* 顶部 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-black leading-tight">
          Hey, Rainey
        </h1>
        <p className="text-xl text-gray-500 mt-2 leading-snug">
          今天有什么灵感迸发？
        </p>
      </div>

      {/* 中间输入区 */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white rounded-card p-5 shadow-sm flex-1 min-h-[200px] relative">
          <InputBox
            value={value}
            onChange={setValue}
            placeholder="想到什么，随手记下来..."
            autoFocus={true}
            multiline={true}
            className="h-full"
          />

          {/* 已选文件预览 */}
          {photos.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap animate-fade-in">
              {photos.map(p => (
                <div key={p.id} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                  {p.type === 'image' || p.type === 'camera' ? (
                    <img src={p.data} alt={p.name} className="w-full h-full object-cover" />
                  ) : p.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/5">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/5">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan">
                        <path d="M9 18V5l12-2v13"/>
                        <circle cx="6" cy="18" r="3"/>
                        <circle cx="18" cy="16" r="3"/>
                      </svg>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemovePhoto(p.id)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 底部工具栏 */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            {/* 左侧：加号按钮 */}
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
        <div className="mt-6 flex items-center justify-end">
          <Button variant="primary" size="md" onClick={handleSubmit}>
            提交
          </Button>
        </div>
      )}
    </div>
  )
}
