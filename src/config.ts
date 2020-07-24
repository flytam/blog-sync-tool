export interface configType {
  csdn: string; // csdn博客地址
  output: string; // 输出源文件位置
  cookie?: string; // cookie信息
  cookies?: string; // 废弃参数
}

export interface generateParams {
  id: string;
  time: string;
  output: string;
  cookie?: string;
  csdn?: string;
}
