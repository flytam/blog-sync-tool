import { run as coreRun } from './core/index.js'

export function run(param: Parameters<typeof coreRun>[0], pure = true) {
  return coreRun(param, pure)
}
