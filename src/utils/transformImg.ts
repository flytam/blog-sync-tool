import { IImgInfo, PicGo } from 'picgo'
import fs from 'fs-extra'
import { Base } from '../extension/base'
import { debug, error, info, success, warn } from '../log'
import { basename, extname } from 'path'

const helpUpload = async (imgConfig: string, imgs: string[]) => {
  const picgo = new PicGo(imgConfig)

  return new Promise(async (resolve, reject) => {
    picgo.helper.beforeUploadPlugins.register('rename', {
      handle: function (ctx) {
        ctx.output.forEach((x) => {
          debug('fileName', x.fileName)
          const ext = extname(x.fileName)
          const name = basename(x.fileName, ext)
          return (x.fileName = `${name}_${Date.now()}${ext}`)
        })
      },
    })

    picgo
      .on('uploadProgress', (progress) => {
        info('上传进度:', progress)
      })
      .on('failed', (e) => {
        error('上传失败 failed', JSON.stringify(e))
        reject()
      })
      .on('notification', (notice) => {
        error('上传失败 notification', JSON.stringify(notice))
      })

    const map: Record<string, string> = {}

    const output = (await picgo.upload(imgs)) as IImgInfo[]

    output.forEach((img, i) => {
      map[imgs[i]] = img.imgUrl
    })

    resolve(map)
  })
}

export const transformImg = async function (this: Base, files: string[]) {
  const imgConfig = this.config.imgConfig
  if (!imgConfig) {
    return
  }
  info('转存图片开始')
  const map = new Map<string, string[]>()

  // 获取图片地址
  for (let file of files) {
    const content = fs.readFileSync(file, 'utf8')
    const urls = content.match(/\!\[.*\]\(.*\)/g)?.map((i) => {
      const url = i.match(/\!\[.*\]\((.*?)( ".*")?\)/)[1]
      return url
    })
    if (urls) {
      map.set(file, urls)
    }
  }

  const upload: string[] = []

  for (let l of map.values()) {
    upload.push(...l)
  }

  const originNewMap = Object.create(null)

  debug('上传列表', upload.join('\n'))

  // 每次传5张。串行传
  info(`开始转存图片，共${upload.length}张`)

  let errorInfo: string[] = []

  let length = 5
  for (let i = 0; i < upload.length; i += length) {
    try {
      info(`转存中: ${i}/${upload.length}...`)
      info(upload.slice(i, i + length).join('\n'))
      const result = await helpUpload(
        this.config.imgConfig,
        upload.slice(i, i + length)
      )
      Object.assign(originNewMap, result)
    } catch (e) {
      // error(e)
      error('转存错误', e)
      errorInfo.push(...upload.slice(i, i + length))
    }
  }

  // 替换图片
  for (let file of files) {
    let content = fs.readFileSync(file, 'utf8')
    const urls = content.match(/\!\[.*\]\(.*\)/g)?.map((i) => {
      const url = i.match(/\!\[.*\]\((.*?)( ".*")?\)/)[1]
      return url
    })

    if (urls) {
      urls.forEach((url) => {
        if (originNewMap[url]) {
          content = content.replace(new RegExp(url, 'g'), originNewMap[url])
        }
      })
      fs.writeFileSync(file, content)
    }
  }

  warn('以下图片转存失败，请手动确认\n', errorInfo.join('\n'))
}
