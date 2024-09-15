import { error, success } from '../log/index.js'

export const successKey = Symbol('success')
export const failKey = Symbol('fail')

export const catchCount = () => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const origin: Function = descriptor?.value
    target[successKey] = 0
    target[failKey] = 0
    descriptor.value = async function (...args: any[]) {
      try {
        const res = await origin?.apply(this, args)
        target[successKey]++
        success(`success: ${target[successKey]};fail: ${target[failKey]}`)
        return res
      } catch (e) {
        error(`${propertyKey} ${args.join(',')} ${e}`)
        target[failKey]++
      }
    }
  }
}
