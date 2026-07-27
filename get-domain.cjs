const qiniu = require('qiniu')

const accessKey = 'PC6q0YTSbLehI5RdLympiiQbw1cc4ERk3lZy4_3e'
const secretKey = 'ueJmnuOGKwAb0W7jGngh6YvImSmHjgqLRwElgqlt'
const bucket = 'mind-flow-demo'

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const config = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, config)

// 列出文件确认上传成功
bucketManager.listPrefix(bucket, { limit: 10 }, (err, body, info) => {
  if (err) {
    console.error('Error:', err)
    return
  }
  console.log('文件数量:', body.items.length)
  console.log('第一个文件:', body.items[0]?.key)
  
  // 七牛云测试域名格式
  console.log('\n可能的测试域名格式:')
  console.log(`- http://${bucket}.kXXiniu.com`)
  console.log(`- http://${bucket}.s3-cn-east-1.qiniucs.com`)
})
