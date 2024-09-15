import { ArticleItem, Base } from '../base.js'
import { Sitdown } from 'sitdown'
import { catchCount } from '../../decorator/index.js'
import { info } from '../../log/index.js'

interface Config {
  /**
   * 用户
   */
  userId: string
  /**
   * 输出路径
   */
  output: string
  /**
   * cookie? 掘金也可以支持cookie，保证拿到markdown
   */
  cookie?: string
}

const sitdown = new Sitdown({
  keepFilter: ['style'],
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
})

export class Juejin extends Base<Config> {
  headers = {}

  async getMain() {
    const articleIds: string[] = []
    let cursor = 0
    while (true) {
      const { data: res } = await this.axios.post<{
        err_no: number
        data: {
          article_id: string
          draft_id: string
        }[]
        has_more: boolean
      }>('https://api.juejin.cn/content_api/v1/article/query_list', {
        cursor: String(cursor),
        sort_type: 2,
        user_id: this.config.userId,
      })

      const { err_no, data, has_more } = res

      if (err_no === 0 && data) {
        articleIds.push(
          ...data.map((x) => (this.config.cookie ? x.draft_id : x.article_id)),
        )
      }
      if (has_more) {
        cursor += 10
      } else {
        break
      }
    }
    return articleIds
  }

  @catchCount()
  async getDetail(id: string): Promise<ArticleItem> {
    const {
      data: {
        data: {
          article_info: { content, ctime, mark_content, title },
          tags,
          category,
        },
      },
    } = await this.axios.post<{
      data: {
        category: {
          category_name: string
        }
        tags: { tag_name: string }[]
        article_info: {
          ctime: string
          mark_content: string
          content: string
          title: string
        }
      }
      err_no: number
    }>('https://api.juejin.cn/content_api/v1/article/detail', {
      article_id: id,
    })

    return {
      title,
      tags: tags.map((x) => x.tag_name),
      content: mark_content || sitdown.HTMLToMD(content),
      categories: [category?.category_name],
      date: new Date(Number(ctime) * 1000).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
      }),
    }
  }

  @catchCount()
  async getDetail2(draftId: string): Promise<ArticleItem> {
    const {
      data: {
        data: {
          article_draft: { mark_content, title, ctime },
          category: { category_name },
          tags,
        },
      },
    } = await this.axios.post<{
      data: {
        article_draft: {
          mark_content: string
          title: string
          ctime: string
        }
        tags: { tag_name: string }[]
        category: { category_name: string }
      }
    }>('https://juejin.cn/content_api/v1/article_draft/detail', {
      draft_id: draftId,
    })
    return {
      content: mark_content,
      title,
      date: new Date(Number(ctime) * 1000).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
      }),
      categories: [category_name],
      tags: tags.map((x) => x.tag_name),
    }
  }

  async run() {
    const list = await this.getMain()
    const resultList: ArticleItem[] = []

    if (this.config.cookie) {
      info('提供cookie')
    } else {
      info('无cookie')
    }

    for (const id of list) {
      info(`拉取:${id}`)
      let result: ArticleItem | undefined

      if (this.config.cookie) {
        result = await this.getDetail2(id)
      } else {
        result = await this.getDetail(id)
      }

      resultList.push(result)
    }
    return resultList
  }
}
