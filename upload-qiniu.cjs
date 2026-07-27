const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')

// 七牛云配置
const accessKey = 'PC6q0YTSbLehI5RdLympiiQbw1cc4ERk3lZy4_3e'
const secretKey = 'ueJmnuOGKwAb0W7jGngh6YvImSmHjgqLRwElgqlt'
const bucket = 'mind-flow-demo'
const zone = 'Zone_z0' // 华东-杭州

// 生成上传凭证
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const putPolicy = new qiniu.rs.PutPolicy({
  scope: bucket,
  expires: 7200
})
const uploadToken = putPolicy.uploadToken(mac)

// 配置
const config = new qiniu.conf.Config()
config.zone = qiniu.zone[zone]
const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()

// 上传单个文件
function uploadFile(localFile, key) {
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, (err, body, info) => {
      if (err) {
        reject(err)
        return
      }
      if (info.statusCode === 200) {
        resolve(body)
      } else {
        reject(new Error(`Upload failed: ${info.statusCode} ${JSON.stringify(body)}`))
      }
    })
  })
}

// 递归获取所有文件
function getFiles(dir, files = []) {
  const items = fs.readdirSync(dir)
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      getFiles(fullPath, files)
    } else {
      files.push(fullPath)
    }
  }
  return files
}

// 主函数
async function main() {
  const distDir = path.join(__dirname, 'dist')
  const files = getFiles(distDir)

  console.log(`Found ${files.length} files to upload...`)

  for (const file of files) {
    const key = file.replace(distDir + path.sep, '').replace(/\\/g, '/')
    try {
      await uploadFile(file, key)
      console.log(`✓ Uploaded: ${key}`)
    } catch (err) {
      console.error(`✗ Failed: ${key} - ${err.message}`)
    }
  }

  console.log('\n✅ All files uploaded successfully!')
  console.log(`\n访问地址: http://${bucket}.kXXiniu.com`)
  console.log('请在七牛云控制台查看具体域名')
}

main().catch(console.error)
