const QRCode = require('qrcode')

const url = 'https://Yuuu-design.github.io/mind-web'

QRCode.toFile('qrcode-github.png', url, {
  width: 400,
  margin: 2,
  color: {
    dark: '#111111',
    light: '#FFFFFF'
  }
}, (err) => {
  if (err) {
    console.error('Error:', err)
    return
  }
  console.log('✅ 二维码已生成: qrcode-github.png')
  console.log('访问地址:', url)
})
