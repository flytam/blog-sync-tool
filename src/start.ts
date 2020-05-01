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
  .option(
    "--cookies [cookies]",
    "任一已经登录csdn的cookies信息（typo：废弃参数，请使用--cookie）"
  )
  .option("--cookie [cookie]", "任一已经登录csdn的cookie信息")
  .parse(process.argv);

console.log(`${version}版本 csdn -> hexo生成器`);

let config = {} as configType;
if (program.config) {
  try {
    config = require(path.resolve(process.cwd(), program.config));
  } catch (e) {
    console.log(e);
  }
} else if (program.csdn && program.output) {
  const { csdn, output, cookies, cookie } = program;

  config = {
    csdn,
    output,
    cookie: cookie ? cookie : cookies,
  };
} else {
  console.error("请指定配置文件路径");
}
if (config.cookies) {
  console.warn("cookies参数是一个typo，请使用cookie代替");
}
if (!config.cookie && !config.cookies) {
  console.log("未提供cookie 使用爬取页面模式，页面数据可能有错误");
} else {
  console.log("提供cookie，使用文章api获取模式");
}
try {
  main(config);
} catch (e) {
  console.warn(e);
}
