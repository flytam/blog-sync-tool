export const output: string = "/"; // 这里可以定向到你的hexo源文件的地方，使用相对路径
// exports.base = "/Users/flytam/Desktop/coding/blog" // hexo博客源文件目录
export const csdn: string = "https://blog.csdn.net/flytam"; // csdn博客地址

export interface configType {
  csdn?: string;
  output?: string;
  base?: string;
}
