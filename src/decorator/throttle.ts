const wait = (delay: number): Promise<void> =>
  new Promise((res) => {
    setTimeout(() => {
      res()
    }, delay)
  })

export const throttle = (delay: number = 500) => {
  let last = 0
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const origin: Function = descriptor?.value
    descriptor.value = async function (...args: any[]) {
      const now = Date.now()
      let rest = Math.max(0, delay - (now - last))
      await wait(rest)
      last = Date.now()
      return origin.apply(this, args)
    }
  }
}
