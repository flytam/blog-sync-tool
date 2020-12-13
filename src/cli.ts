import program from 'commander'

import path from 'path'
import { run } from './core'
import { error, info } from './log'
// cli
const { version } = require('../package.json')

export const cli = async () => {
  program
    .version(version)
    .option('-c, --config [config]', '配置文件相对路径')
    .option('-o, --output [output]', '本地生成博客源md文件路径')
    .option('--userId [userId]', '用户id')
    .option('--cookie [cookie]', 'cookie信息')
    .parse(process.argv)

  let config = {}
  if (program.config) {
    // 配置文件
    try {
      config = require(path.resolve(process.cwd(), program.config))
    } catch (e) {
      error(e)
    }
  } else {
    // 命令行
    config = program.config
  }
  info('运行配置：', JSON.stringify(config))
  await run(config)
}

cli()
