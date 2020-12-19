import Picgo from 'picgo'
import fs from 'fs-extra'
import { Base } from '../extension/base'
import { info } from '../log'

let picgo: Picgo = null

const helpUpload = (imgConfig: string, imgs: string[]) => {
  const p = new Promise<Record<string, string>>((resolve) => {
    if (!picgo) {
      picgo = new Picgo(imgConfig).on('finished', (ctx) => {
        const res = (ctx.output as any[]).reduce<Record<string, string>>(
          (map, item, index) => {
            map[imgs[index]] = item.imgUrl
            return map
          },
          {}
        )
        resolve(res)
      })

      picgo.helper.beforeUploadPlugins.register('rename', {
        handle: function (ctx) {
          ctx.output.forEach((x) => {
            return (x.fileName = x.fileName + Date.now())
          })
        },
      })
    }

    picgo.upload(imgs)
  })
  return p
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

  // 每次传5张。串行传
  info(`开始转存图片，共${upload.length}张`)
  let length = 2
  for (let i = 0; i < upload.length; i += length) {
    try {
      const result = await helpUpload(
        this.config.imgConfig,
        upload.slice(i, i + length)
      )
      Object.assign(originNewMap, result)
    } catch (e) {
      console.log(e)
    }
  }

  // 替换图片
  for (let file of files) {
    let content = fs.readFileSync(file, 'utf8')
    const urls = content.match(/\!\[.*\]\(.*\)/g)?.map((i) => {
      const url = i.match(/\!\[.*\]\((.*?)( ".*")?\)/)[1]
      return url
    })
    urls.forEach((url) => {
      if (originNewMap[url]) {
        content = content.replace(new RegExp(url, 'g'), originNewMap[url])
      }
    })
    fs.writeFileSync(file, content)
  }
}
