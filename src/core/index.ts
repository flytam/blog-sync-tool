import { extentions } from './config'
import { writeFile } from './writeFile'

export const run = async function <
  T extends { type?: keyof typeof extentions } = unknown
>(param: T) {
  if (extentions[param.type]) {
    const extention = new extentions[param.type](param as any)
    const list = await extention.run()
    const file = writeFile(list, extention.config.output)
    // 生成文件后的操作
    await new Promise<void>((res) => setTimeout(() => res(), 2000))
    // 同步后也不是马上？
    await extention.generateSuccess(file)
  } else {
    throw new Error('invalid type')
  }
}
