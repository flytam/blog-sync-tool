import { extentions } from './config'
import { writeFile } from './writeFile'

export const run = async function <
  T extends { type?: keyof typeof extentions } = unknown
>(param: T) {
  if (extentions[param.type]) {
    const extention = new extentions[param.type](param as any)
    const list = await extention.run()
    writeFile(list, extention.config.output)
  } else {
    throw new Error('invalid type')
  }
}
