import { initPlatformExtension } from '../decorator/platform'
import { Base } from '../extension/base'
import { writeFile } from './writeFile'

export const run = async function <T extends Record<string, any> = unknown>(
  param: T,
  pure = false
) {
  const extensions = await initPlatformExtension()
  if (extensions[param.type]) {
    const extension = (new extensions[param.type](
      param as any
    ) as unknown) as Base
    const list = await extension.run()

    if (pure) {
      return list
    }

    const file = writeFile(list, extension.config.output)
    // 生成文件后的操作
    await new Promise<void>((res) => setTimeout(() => res(), 2000))
    // 同步后也不是马上？
    await extension.generateSuccess(file)

    return list
  } else {
    throw new Error('invalid type')
  }
}
