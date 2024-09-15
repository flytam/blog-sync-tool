import { initPlatformExtension } from '../decorator/platform.js'
import { Base } from '../extension/base.js'
import { success } from '../log/index.js'
import { writeFile } from './writeFile.js'

export const run = async function <T extends Record<string, any> = any>(
  param: T,
  pure = false,
) {
  const extensions = await initPlatformExtension()

  success(`加载插件完成 ${Object.keys(extensions).join(',')}`)

  if (extensions[param.type]) {
    const extension = new extensions[param.type](
      param as any,
    ) as unknown as Base
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
    throw new Error(`invalid type: ${param.type}, Please check`)
  }
}
