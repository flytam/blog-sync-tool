> csdn 最近经常改 api 域名...遇到不能用了，提 issue 反馈，本仓库会及时跟进

# CsdnSyncHexo

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![npm license][license-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/csdnsynchexo.svg?style=flat-square
[npm-url]: https://npmjs.org/package/csdnsynchexo
[travis-image]: https://img.shields.io/travis/flytam/CsdnSyncHexo.svg?style=flat-square
[travis-url]: https://travis-ci.org/flytam/CsdnSyncHexo
[coveralls-image]: https://img.shields.io/coveralls/flytam/CsdnSyncHexo.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/flytam/CsdnSyncHexo?branch=master
[david-image]: https://img.shields.io/david/flytam/CsdnSyncHexo.svg?style=flat-square
[david-url]: https://david-dm.org/flytam/CsdnSyncHexo
[node-image]: https://img.shields.io/badge/node.js-%3E=_8.0.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/csdnsynchexo.svg?style=flat-square
[download-url]: https://npmjs.org/package/csdnsynchexo
[license-image]: https://img.shields.io/npm/l/csdnsynchexo.svg

一个方便的一键同步 csdn 博客上的内容到 hexo 源文件工具

> 2020.07.24 修复`socket up`报错 & 打印成功/失败次数

> 2020.5.01 更新，支持不传递 cookie，此时则为直接爬去 html 解析

> 2020.2.15 更新：[无需下载依赖的可执行程序参考](https://github.com/flytam/blog-sync)

大家在日常写博客的过程中，肯定会遇到想迁移博客的时候。例如我之前就遇到想把 csdn 博客文章迁移到 hexo 上。hexo 的文章源文件就是一些符合特定格式 markdown 的文章。因此要实现也比较简单，对 csdn 博客首页 进行爬虫，（都是一些一些基础的获取标签之类的内容操作了，不详细讲了），然后生成符合特定格式 markdown 即可。

#### Quick Start

> 前提已经安装 nodejs

1、全局安装工具

```bash
npm i -g csdnsynchexo
```

2、获取 csdn 的 cookie（可选）

> 若不配置 cookie，则爬 html 解析，这种情况是无法获取到标签的。若提供，则使用 api 进行爬取`https://blog-console-api.csdn.net/v1/editor/getArticle?id=本人文章id`

tips: (这里这么做是因为 csdn 的文章详情`api`只需要有任意的已登陆的合法 cookie 就能够根据文章 id 拉取信息了。csdn 的模拟登录破解不出来 T T)

2.1 登录后，点击将这个 [url](https://blog-console-api.csdn.net/v1/editor/getArticle?id=104101476)复制下面这段的 cookie 到配置文件或者指定运行。
![image](https://user-images.githubusercontent.com/20512530/76138846-d2b1b580-6085-11ea-9900-5626737eb641.png)

3、配置文件

在当前目录下新建`config.json`，内容如下

> tips: json 记得去掉注释。就是//后面的内容

```json
// config.json
{
  "csdn": "https://blog.csdn.net/flytam", // 要爬取的csdn博客地址
  "output": "./example", // 输出hexo文章源markdown的目录
  "cookie": "xxxx" // 可选，若提供cookie，只能爬取自己的文章
}
```

4、执行生成

```bash
hsync --config ./config.json
```

5、结果

![](https://user-gold-cdn.xitu.io/2020/1/28/16feb9fe834566b6?w=1088&h=1030&f=png&s=404776)

![](https://user-gold-cdn.xitu.io/2020/1/28/16feba0a3866cb42?w=1088&h=1030&f=png&s=235978)
可以看到，我们的 hexo 源文件就生成成功了

码字不易。本工具[仓库](https://github.com/flytam/CsdnSyncHexo)地址。如果觉得有用，你的 star 是我最大的动力 - -

### license

MIT
