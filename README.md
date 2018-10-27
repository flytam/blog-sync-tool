# CsdnSyncHexo

一个方便的一键同步 csdn 博客上的内容到 hexo 的命令行工具

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
exports.output = "/Users/flytam/Desktop/coding/blog/source/_posts"; // 这里可以定向到你的hexo源文件的地方，使用相对路径
exports.base = "/Users/flytam/Desktop/coding/blog"; // hexo博客源文件目录
```

```bash
// 指定配置文件
hsync --config 配置文件相对路径
```

#### 查看帮助

```bash
hsync --help
```

### 单元测试

待添加

### license

MIT
