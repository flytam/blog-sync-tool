import { ArticleItem, Base, Config } from '../base'
import { info } from '../../log'
import { platform } from '../../decorator/platform'

interface GithubConfig extends Config {
  /**
   * 仓库地址
   */
  repo: string
}

interface Issue {
  title: string
  id: number
  labels?: {
    name: string
    id: number
  }[]
  user: {
    login: string
  }
  created_at: string
  updated_at: string
  body: string
}
@platform('github')
export class Github extends Base<GithubConfig> {
  headers = {}

  articleMap: Record<string, Issue> = {}

  async getMain() {
    const { config } = this
    const ids: number[] = []

    let index = 1

    while (true) {
      const { data } = await this.axios.get<Issue[]>(
        `https://api.github.com/repos/${config.userId}/${config.repo}/issues?per_page=100&page=${index}`
      )

      if (!data.length) {
        break
      }

      index++

      for (const item of data) {
        if (item.user.login !== config.userId) {
          continue
        }
        ids.push(item.id)
        this.articleMap[item.id] = item
      }
    }

    info('获取github数据完成')
    return ids
  }

  async getDetail(id: number): Promise<ArticleItem> {
    const item = this.articleMap[id]
    return {
      title: item.title,
      date: new Date(item.created_at).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
      }),
      tags: item.labels.map((x) => x.name),
      content: item.body,
      categories: item.labels.map((x) => x.name),
    }
  }
}
