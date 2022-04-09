import { run as coreRun } from './core'

export function run(param: Parameters<typeof coreRun>[0], pure = true) {
  return coreRun(param, pure)
}
