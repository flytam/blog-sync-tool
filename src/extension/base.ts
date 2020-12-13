import axios from 'axios'
import { error, info } from '../log'

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
}

export abstract class Base<TConfig extends Config = Config> {
  config: TConfig

  /**
   * 请求头
   */
  protected abstract headers: Record<string, string>

  constructor(config: TConfig) {
    this.config = config
    axios.interceptors.request.use((c) => {
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
    for (let id of list) {
      info(`拉取:${id}`)
      let result = await this.getDetail(id)
      resultList.push(result)
    }
    return resultList
  }

  async getMain(): Promise<any[]> {
    error('实现该方法')
    return []
  }

  async getDetail(id: string): Promise<ArticleItem> {
    error('实现该方法')
    return null
  }
}
