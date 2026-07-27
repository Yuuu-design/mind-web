const qiniu = require('qiniu')

const accessKey = 'PC6q0YTSbLehI5RdLympiiQbw1cc4ERk3lZy4_3e'
const secretKey = 'ueJmnuOGKwAb0W7jGngh6YvImSmHjgqLRwElgqlt'
const bucket = 'mind-flow-demo'

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const config = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, config)

// 列出 Bucket 中的文件
bucketManager.listPrefix(bucket, { limit: 100 }, (err, body, info) => {
  if (err) {
    console.error('Error:', err)
    return
  }
  if (info.statusCode === 200) {
    console.log(`Bucket "${bucket}" 中的文件:`)
    if (body.items && body.items.length > 0) {
      body.items.forEach((item, i) => {
        console.log(`${i + 1}. ${item.key} (${item.fsize} bytes)`)
      })
    } else {
      console.log('Bucket 为空')
    }
  } else {
    console.error('请求失败:', info.statusCode, JSON.stringify(body))
  }
})
