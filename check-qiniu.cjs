const qiniu = require('qiniu')

const accessKey = 'PC6q0YTSbLehI5RdLympiiQbw1cc4ERk3lZy4_3e'
const secretKey = 'ueJmnuOGKwAb0W7jGngh6YvImSmHjgqLRwElgqlt'

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const config = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, config)

// 列出所有 Bucket
bucketManager.listBucket((err, body, info) => {
  if (err) {
    console.error('Error:', err)
    return
  }
  if (info.statusCode === 200) {
    console.log('你的 Bucket 列表:')
    body.forEach((bucket, i) => {
      console.log(`${i + 1}. ${bucket}`)
    })
  } else {
    console.error('请求失败:', info.statusCode, JSON.stringify(body))
  }
})
