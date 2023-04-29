import { ArticleItem } from '../extension/base'
import fs from 'fs-extra'
import path from 'path'
import filenamify from 'filenamify'
import { debug, error, info } from '../log'

export const writeFile = (list: ArticleItem[], output = './') => {
  const dir = path.resolve(output)
  const outputFile: string[] = []
  info('输出路径', dir)
  fs.ensureDirSync(dir)
  let writeStream: fs.WriteStream = null

  for (let item of list) {
    if (!item) {
      continue
    }
    const { tags, title, categories, content, date } = item
    const filename = path.join(dir, `./${filenamify(title)}.md`)
    try {
      writeStream = fs.createWriteStream(filename, 'utf8')
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
      outputFile.push(filename)
    } catch (e) {
      error(`出错: ${title}`, e)
    } finally {
      if (writeStream) {
        writeStream.close()
      }
    }
  }
  return outputFile
}
