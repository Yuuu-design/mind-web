// 模拟 AI 灵感合成 —— V1 Demo 用本地逻辑替代真实 AI 调用
// 后续可替换为真实 API

const connectors = [
  '如果将',
  '与',
  '结合，或许可以',
  '联系起来，我们也许能',
  '碰撞一下，可能会',
  '互相激发，可以尝试'
]

const actions = [
  '创造一种全新的体验',
  '设计一个有趣的实验',
  '做成一个小项目',
  '发展成一个故事',
  '打造成一个产品概念',
  '融合成一种表达方式',
  '变成一个有趣的挑战'
]

const endings = [
  '——听起来就很有趣。',
  '——试试看会怎样？',
  '——这值得探索。',
  '——这可能会成为下一个突破。',
  '——大胆去做吧。'
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const wrap = (t) => '[' + t + ']'

/**
 * 合成灵感
 * @param {Array} items - 选中的灵感对象数组，每个包含 title / detail
 * @returns {{ title: string, detail: string }}
 */
export function synthesizeIdeas(items) {
  if (!items || items.length === 0) {
    return { title: '灵感种子', detail: '选择更多灵感来合成新想法。' }
  }

  if (items.length === 1) {
    const t = items[0].title
    return {
      title: t + ' · 深化',
      detail: '从' + wrap(t) + '出发，' + pick(actions) + pick(endings)
    }
  }

  const titles = items.map(i => i.title)
  const first = titles[0]
  const second = titles[1]
  const rest = titles.slice(2)

  var content = pick(connectors) + wrap(first) + '和' + wrap(second) + pick(actions)

  if (rest.length > 0) {
    content += '。同时加入' + rest.map(function(t){ return wrap(t) }).join('、') + '的元素'
  }

  content += pick(endings)

  const titlePrefixes = ['新构想：', '创意合成 · ', '灵感火花：', '新可能：']
  const shortTitles = titles.map(function(t) { return t.slice(0, 4) })
  const title = pick(titlePrefixes) + shortTitles.join(' × ')

  return { title: title, detail: content }
}

/**
 * 生成今日鼓励语
 */
export function getDailyHint() {
  const hints = [
    '今天想点什么新奇的？',
    '一个想法改变一天',
    '灵感来了，就抓住它',
    '先记录，再整理',
    '每一个碎片都有意义',
    '让想法自由流动'
  ]
  return pick(hints)
}
