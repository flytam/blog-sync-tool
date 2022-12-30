import glob from 'glob'
import { join } from 'path'
import { info } from '../log'

const platformMap: Record<string, FunctionConstructor> = {}

export function platform(name: string) {
  return function (target: any) {
    platformMap[name] = target
  }
}

export async function initPlatformExtension() {
  const files = glob.sync(join(__dirname, '../extension/**/*.js'))
  files.forEach((file) => {
    require(file)
    info(`Loaded extension ${file}`)
  })

  return platformMap
}
