import { run as coreRun } from './core'

export function run(param: Parameters<typeof coreRun>[0]) {
  return coreRun(param, true)
}
