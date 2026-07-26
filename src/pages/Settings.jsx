import React, { useState } from 'react'
import BackButton from '../components/BackButton'

export default function Settings({
  inspirations,
  todos,
  streak,
  onChangeNav,
  onResetData,
  onExportData,
  darkMode,
  onToggleDarkMode
}) {
  const [showArchive, setShowArchive] = useState(false)

  // 统计数据
  const totalInsp = inspirations.filter(i => !i.archived).length
  const totalDone = todos.filter(t => t.completed).length
  const synthesized = inspirations.filter(i => i.synthesized).length
  const archived = inspirations.filter(i => i.archived)

  return (
    <div className="h-full flex flex-col px-6 pt-14 pb-8 animate-fade-in">
      {/* 顶部 */}
      <div className="flex items-center gap-4 mb-6">
        <BackButton onClick={() => onChangeNav('home')} />
        <h1 className="text-2xl font-bold text-black">设置</h1>
      </div>

      {/* 个人信息 */}
      <div className="bg-white rounded-card p-5 shadow-sm mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-cyan flex items-center justify-center text-xl font-bold">
            R
          </div>
          <div>
            <h3 className="font-bold text-base">Rainey</h3>
            <p className="text-xs text-gray-400">灵感收集者</p>
          </div>
        </div>
      </div>

      {/* 成就展示 */}
      <div className="bg-white rounded-card p-5 shadow-sm mb-4">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
          </svg>
          成就
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="灵感" value={totalInsp} color="cyan" />
          <StatCard label="连续" value={`${streak}天`} color="pink" />
          <StatCard label="完成" value={totalDone} color="black" />
        </div>
        {synthesized > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              已合成
            </span>
            <span className="text-xs font-bold text-black">{synthesized} 个新创意</span>
          </div>
        )}
      </div>

      {/* 灵感归档 */}
      <button
        onClick={() => setShowArchive(true)}
        className="bg-white rounded-card p-5 shadow-sm mb-4 text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
          </svg>
          <h3 className="text-sm font-bold">灵感归档</h3>
        </div>
        <div className="flex items-center gap-2">
          {archived.length > 0 && (
            <span className="text-xs bg-pink/20 text-pink px-2 py-0.5 rounded-full">{archived.length}</span>
          )}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </button>

      {/* 基本设置 */}
      <div className="bg-white rounded-card p-5 shadow-sm">
        <h3 className="text-sm font-normal mb-4 flex items-center gap-2 text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          基本设置
        </h3>
        <div className="space-y-3">
          <SettingRow
            label="夜间提醒"
            desc="22:00 检查未完成事项"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            }
          />
          <SettingRow
            label="数据管理"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            }
          />
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <span className="text-sm font-medium">深色模式</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`w-10 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-cyan' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <button
            onClick={onExportData}
            className="w-full text-left py-2 text-sm text-black font-medium flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            导出数据
          </button>
          <button
            onClick={onResetData}
            className="w-full text-left py-2 text-sm text-pink font-medium flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
            重置所有数据
          </button>
        </div>
      </div>

      {/* 灵感归档弹窗 */}
      {showArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowArchive(false)} />
          <div className="relative bg-white rounded-card p-6 w-full max-w-sm shadow-2xl animate-pop max-h-[70vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                </svg>
                灵感归档
              </h3>
              <button
                onClick={() => setShowArchive(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            {archived.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">暂无归档的灵感</p>
            ) : (
              <div className="space-y-3">
                {archived.map(i => (
                  <div key={i.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="font-medium text-sm text-black">{i.title}</div>
                    {i.detail && <div className="text-xs text-gray-500 mt-1">{i.detail}</div>}
                    <div className="text-[10px] text-gray-400 mt-2">{i.time || i.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = {
    cyan: 'bg-cyan/20 text-black',
    pink: 'bg-pink/20 text-pink',
    black: 'bg-black text-white'
  }
  return (
    <div className={`${colors[color]} rounded-2xl p-3 text-center`}>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-[10px] mt-0.5 opacity-70">{label}</div>
    </div>
  )
}

function SettingRow({ label, desc, icon }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">{icon}</span>
        <div>
          <div className="text-sm font-medium">{label}</div>
          {desc && <div className="text-[10px] text-gray-400">{desc}</div>}
        </div>
      </div>
      <div className="w-10 h-6 bg-gray-200 rounded-full relative">
        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
      </div>
    </div>
  )
}
