import React from 'react'
import BackButton from '../components/BackButton'

export default function Settings({
  inspirations,
  todos,
  streak,
  onChangeNav,
  onResetData
}) {
  // 统计数据
  const totalInsp = inspirations.length
  const totalDone = todos.filter(t => t.completed).length
  const synthesized = inspirations.filter(i => i.synthesized).length

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
        <h3 className="text-sm font-bold mb-4">成就</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="灵感" value={totalInsp} color="cyan" />
          <StatCard label="连续" value={`${streak}天`} color="pink" />
          <StatCard label="完成" value={totalDone} color="black" />
        </div>
        {synthesized > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <span className="text-xs text-gray-400">✨ 已合成</span>
            <span className="text-xs font-bold text-black">{synthesized} 个新创意</span>
          </div>
        )}
      </div>

      {/* 灵感归档 */}
      <div className="bg-white rounded-card p-5 shadow-sm mb-4">
        <h3 className="text-sm font-bold">灵感归档</h3>
        <p className="text-xs text-gray-400 mt-1">查看所有历史灵感</p>
      </div>

      {/* 基本设置 */}
      <div className="bg-white rounded-card p-5 shadow-sm">
        <h3 className="text-sm font-bold mb-4">基本设置</h3>
        <div className="space-y-3">
          <SettingRow label="夜间提醒" desc="22:00 检查未完成事项" />
          <SettingRow label="数据管理" desc="所有数据保存在本地" />
          <button
            onClick={onResetData}
            className="w-full text-left py-2 text-sm text-pink font-medium"
          >
            重置所有数据
          </button>
        </div>
      </div>

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

function SettingRow({ label, desc }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[10px] text-gray-400">{desc}</div>
      </div>
      <div className="w-10 h-6 bg-gray-200 rounded-full relative">
        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
      </div>
    </div>
  )
}
