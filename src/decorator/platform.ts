import { debug, info } from '../log/index.js'

//...
import { Tengxunyun } from '../extension/tengxunyun/index.js'
import { Segmentfault } from '../extension/segmentfault/index.js'
import { Juejin } from '../extension/juejin/index.js'
import { JuejinBook } from '../extension/juejinbook/index.js'
import { Github } from '../extension/github/index.js'
import { Csdn } from '../extension/csdn/index.js'
import { Bokeyuan } from '../extension/bokeyuan/index.js'

let platformMap: Record<string, any> = {
  Tengxunyun,
  Segmentfault,
  Juejin,
  JuejinBook,
  Github,
  Csdn,
  Bokeyuan,
}

export async function initPlatformExtension() {
  platformMap = Object.keys(platformMap).reduce<Record<string, any>>((m, k) => {
    m[k.toLowerCase()] = platformMap[k]
    return m
  }, {})

  debug('平台\n', Object.keys(platformMap).join('\n'))

  return platformMap
}
