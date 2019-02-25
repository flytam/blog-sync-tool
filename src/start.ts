#!/usr/bin/env node
import program from "commander";
import { configType } from "./config";
import main from "./main";
import path from "path";
import { version } from "../package.json";
program
  .version(version)
  .option("-c, --config [config]", "配置文件相对路径")
  .option("-o, --output [output]", "本地生成博客源md文件路径")
  .option("--csdn [csdn]", "csdn博客地址")
  .option("-b,--base[base]", "本地hexo根目录，不提供则不执行hexo d")
  .option("--cookies [cookies]", "任一已经登录csdn的cookies信息")
  .parse(process.argv);

console.log(`${version}版本 csdn -> hexo生成器`);

let config: configType = {};
if (program.config) {
  try {
    config = require(path.join(__dirname, program.config));
    console.log(config);
  } catch (e) {
    console.log(e);
  }
} else if (program.csdn && program.output) {
  const { csdn, output, base, cookies } = program;
  config = {
    csdn,
    output,
    base,
    cookies
  };
} else {
  console.error("请指定配置文件路径");
}
main(config);
