import { ArticleItem, Base } from '../base'
import { catchCount } from '../../decorator'
import { platform } from '../../decorator/platform'
import { Sitdown } from 'sitdown'

const sitdown = new Sitdown({
  keepFilter: ['style'],
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
})

interface Config {
  /**
   * 小册id，如https://juejin.cn/book/7070324244772716556 的7070324244772716556
   */
  userId: string
  /**
   * 输出路径
   */
  output: string
  /**
   * 掘金已购小册的账号cookie
   */
  cookie?: string
}

@platform('juejin_book')
export class JuejinBook extends Base<Config> {
  headers = {
    // 'user-agent':
    //   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
    // cookie: this.config.cookie,
    // 'content-type': 'application/json'
  }

  bookTitle = ''

  async getMain() {
    const { data, config } = await this.axios.post<{
      data: {
        sections: {
          section_id: number
        }[]
        booklet: {
          base_info: {
            title: string
          }
        }
      }
    }>('https://api.juejin.cn/booklet_api/v1/booklet/get', {
      booklet_id: `${this.config.userId}`,
    })

    this.bookTitle = data?.data?.booklet?.base_info?.title

    return data?.data?.sections.map((x) => x.section_id)
  }

  @catchCount()
  async getDetail(id: string): Promise<ArticleItem> {
    const { data } = await this.axios.post<{
      data: {
        section: {
          markdown_show: string
          content: string
          title: string
          ctime: number
        }
      }
    }>('https://api.juejin.cn/booklet_api/v1/section/get', {
      section_id: id,
    })

    return {
      title: data?.data?.section?.title,
      tags: this.bookTitle ? [this.bookTitle] : [],
      content:
        data?.data?.section?.markdown_show ||
        sitdown.HTMLToMD(data?.data?.section?.content ?? ''),
      categories: this.bookTitle ? [this.bookTitle] : [],
      date: new Date(Number(data?.data?.section?.ctime) * 1000).toLocaleString(
        'en-US',
        {
          timeZone: 'Asia/Shanghai',
        }
      ),
    }
  }
}
