const QRCode = require('qrcode')

const url = 'http://tis9einxs.hd-bkt.clouddn.com'

// 生成二维码图片
QRCode.toFile('qrcode.png', url, {
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
  console.log('✅ 二维码已生成: qrcode.png')
  console.log('访问地址:', url)
})
