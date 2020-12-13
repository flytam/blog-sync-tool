import { ArticleItem } from '../extension/base'
import fs from 'fs-extra'
import path from 'path'
import filenamify from 'filenamify'
import { error, info } from '../log'

export const writeFile = (list: ArticleItem[], output = './') => {
  const dir = path.resolve(output)
  info('输出路径', dir)
  fs.ensureDirSync(dir)
  let writeStream: fs.WriteStream = null
  for (let { tags, title, categories, content, date } of list) {
    try {
      writeStream = fs.createWriteStream(
        path.join(output, `./${filenamify(title)}.md`),
        'utf8'
      )
      writeStream.write('---\n')
      writeStream.write(`title: ${title}\n`)
      writeStream.write(`date: ${date}\n`)
      writeStream.write(`tags: ${tags.join(' ')}\n`)
      writeStream.write(`categories: ${categories.join(' ')}\n`)
      writeStream.write('---\n\n')
      writeStream.write('<!--more-->\n\n')
      writeStream.write(content || '')
      writeStream.end('')
      writeStream.close()
    } catch (e) {
      error(`出错: ${title}`, e)
    } finally {
      if (writeStream) {
        writeStream.close()
      }
    }
  }
}
