import axios, { AxiosInstance } from 'axios'
import { error, info } from '../log'
import { transformImg } from '../utils'

export interface ArticleItem {
  title: string
  date: string
  tags: string[]
  categories: string[]
  content: string
}

export interface Config {
  /**
   * 用户
   */
  userId: string
  /**
   * 输出路径
   */
  output: string
  /**
   * cookie?
   */
  cookie?: string
  imgConfig?: string
}

export abstract class Base<TConfig extends Config = Config> {
  config: TConfig

  /**
   * 请求头
   */
  protected abstract headers: Record<string, string>

  axios: AxiosInstance

  constructor(config: TConfig) {
    this.config = config
    this.axios = axios.create()
    this.axios.interceptors.request.use((c) => {
      info(`request: ${c.method} ${c.url}`)
      if (config.cookie) {
        Object.assign(this.headers, {
          cookie: config.cookie,
        })
      }
      Object.assign(c.headers, this.headers)
      return c
    })
  }

  async run() {
    const list = await this.getMain()
    const resultList: ArticleItem[] = []
    for (const id of list) {
      info(`拉取:${id}`)
      const result = await this.getDetail(id)
      resultList.push(result)
    }
    return resultList
  }

  async getMain(): Promise<any[]> {
    error('实现该方法')
    return []
  }

  async getDetail(id: string | number): Promise<ArticleItem> {
    error('实现该方法')
    return null
  }

  /**
   * 生成文件后的操作
   */
  async generateSuccess(file: string[]) {
    if (this.config.imgConfig) {
      try {
        await transformImg.call(this, file)
      } catch (e) {
        error('图片转存失败')
      }
    }
  }
}
