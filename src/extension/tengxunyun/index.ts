import { catchCount } from '../../decorator'
import { Base } from '../base'
import cheerio from 'cheerio'
import { Sitdown } from 'sitdown'
import { platform } from '../../decorator/platform'

const sitdown = new Sitdown({
  keepFilter: ['style'],
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
})

@platform('tengxunyun')
export class Tengxunyun extends Base {
  headers = {}
  articleMap = new Map<
    number,
    {
      tags: string[]
      title: string
      date: string
      categories: string[]
    }
  >()
  async getMain() {
    let page = 1
    let ids: number[] = []
    while (true) {
      const { data: res } = await this.axios.post<{
        code: number
        data: {
          list: {
            articleId: number
            tags: { name: string }[]
            writeTime: number
            title: string
            column: { name: string }
          }[]
        }
      }>(
        'https://cloud.tencent.com/developer/services/ajax/user-center?action=FetchUserArticles',
        {
          action: 'FetchUserArticles',
          payload: {
            pageNumber: page++,
            pageSize: 20,
            uid: this.config.userId,
          },
        }
      )

      if (res.code === 0 && res.data?.list.length > 0) {
        res.data.list.forEach((x) => {
          ids.push(x.articleId)
          this.articleMap.set(x.articleId, {
            tags: x.tags.map((xx) => xx.name),
            title: x.title,
            date: new Date(x.writeTime * 1000).toLocaleDateString(),
            categories: [x.column?.name],
          })
        })
      } else if (res.data.list.length === 0) {
        break
      }
    }

    return ids
  }

  @catchCount()
  async getDetail(id: number) {
    const { data: html } = await this.axios.get(
      ` https://cloud.tencent.com/developer/article/${id} `
    )

    const $ = cheerio.load(html, {
      decodeEntities: true,
    })
    const content = sitdown.HTMLToMD($('.com-markdown-collpase').html())
    const item = this.articleMap.get(id)
    return {
      content,
      ...item,
    }
  }
}
