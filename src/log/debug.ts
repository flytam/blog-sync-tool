import chalk from 'chalk'

export const debug = (...args: any[]) =>
  process.env.ENV === 'DEBUG' && console.log(chalk.greenBright(...args))
