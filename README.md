# CsdnSyncHexo

[![NPM version][npm-image]][npm-url]

<!-- [![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url] -->

[![node version][node-image]][node-url]

[![npm download][download-image]][download-url]

<!-- [![npm license][license-image]][download-url] -->

[npm-image]: https://img.shields.io/npm/v/hsync.svg?style=flat-square
[npm-url]: https://npmjs.org/package/hsync
[travis-image]: https://img.shields.io/travis/flytam/CsdnSyncHexo.svg?style=flat-square
[travis-url]: https://travis-ci.org/flytam/CsdnSyncHexo
[coveralls-image]: https://img.shields.io/coveralls/flytam/CsdnSyncHexo.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/flytam/CsdnSyncHexo?branch=master
[david-image]: https://img.shields.io/david/flytam/CsdnSyncHexo.svg?style=flat-square
[david-url]: https://david-dm.org/flytam/CsdnSyncHexo
[node-image]: https://img.shields.io/badge/node.js-%3E=_8.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/hsync.svg?style=flat-square
[download-url]: https://npmjs.org/package/hsync
[license-image]: https://img.shields.io/npm/l/hsync.svg

[![GitHub license](https://img.shields.io/github/license/flytam/CsdnSyncHexo.svg)](https://github.com/flytam/CsdnSyncHexo/blob/master/LICENSE)

一个方便的一键同步 csdn 博客上的内容到 hexo 源文件的命令行工具

### 使用

#### 全局安装

```bash
npm i -g hsync
```

#### 命令行指定运行

```bash
hsync --output /Users/flytam/Desktop/coding/blog/source/_posts --base /Users/flytam/Desktop/coding/blog --csdn https://blog.csdn.net/flytam
```

#### 配置文件运行

```js
// 配置文件
exports.csdn = "https://blog.csdn.net/flytam"; // csdn博客地址
exports.output = "/Users/flytam/Desktop/coding/blog/source/_posts"; // 这里可以定向到你的hexo源文件的地方
exports.base = "/Users/flytam/Desktop/coding/blog"; // hexo博客源文件目录，用于执行hexo命令
```

```bash
// 指定配置文件
hsync --config 配置文件相对路径
```

#### 查看帮助

```bash
hsync --help
```

#### 已知 bug

1、解析代码块不太好

2、获取 csdn 文章的标签和分类有点问题

### 单元测试

待添加

### license

MIT
