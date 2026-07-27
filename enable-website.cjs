const qiniu = require('qiniu')

const accessKey = 'PC6q0YTSbLehI5RdLympiiQbw1cc4ERk3lZy4_3e'
const secretKey = 'ueJmnuOGKwAb0W7jGngh6YvImSmHjgqLRwElgqlt'
const bucket = 'mind-flow-demo'

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const config = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, config)

// 设置 Bucket 为公开（尝试）
bucketManager.setBucketAccessMode(bucket, { mode: 'public' }, (err, body, info) => {
  if (err) {
    console.error('setBucketAccessMode Error:', err)
    return
  }
  console.log('setBucketAccessMode Status:', info.statusCode)
  console.log('Response:', JSON.stringify(body))
})

// 尝试设置 Bucket 信息
bucketManager.updateBucket(bucket, { noIndexPage: 0 }, (err, body, info) => {
  if (err) {
    console.error('updateBucket Error:', err)
    return
  }
  console.log('updateBucket Status:', info.statusCode)
  console.log('Response:', JSON.stringify(body))
})
