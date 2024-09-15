import { ArticleItem, Base } from '../base.js'
import { load } from 'cheerio'
import { Sitdown } from 'sitdown'
import { catchCount } from '../../decorator/index.js'

const sitdown = new Sitdown({
  keepFilter: ['style'],
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
})

export class Bokeyuan extends Base {
  headers = {}

  @catchCount()
  async getDetail(url: string): Promise<ArticleItem> {
    const { data: html } = await this.axios.get(
      //   `https://www.cnblogs.com/${this.config.userId}/p/${id}.html`
      url,
    )
    const $ = load(html)
    const content = sitdown.HTMLToMD($('#cnblogs_post_body').html() as string)
    const title = $('.postTitle .postTitle2 span').text()
    const date = $('#post-date').text()
    const categories: string[] = []
    $('#BlogPostCategory a').each(function () {
      categories.push($(this).text())
    })

    const tags: string[] = []
    $('#EntryTag a').each(function () {
      tags.push($(this).text())
    })

    return {
      title,
      tags,
      content,
      categories,
      date,
    }
  }

  async getMain() {
    let page = 1
    const urls: string[] = []

    while (true) {
      const { data: html } = await this.axios.get(
        `https://www.cnblogs.com/${
          this.config.userId
        }/default.html?page=${page++}`,
      )
      const $ = load(html)
      const list = $('.postTitle .postTitle2')

      if (list?.length > 0) {
        list.each(function () {
          const url = $(this).attr('href')

          if (url) {
            urls.push(url)
          }
        })
      } else {
        break
      }
    }
    return urls
  }
}
