import { ArticleItem, Base } from '../base'
import axios from 'axios'
import { Sitdown } from 'sitdown'
import cheerio from 'cheerio'
import { url } from 'inspector'
import { catchCount } from '../../decorator'
import { platform } from '../../decorator/platform'

const sitdown = new Sitdown({
  keepFilter: ['style'],
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
})

@platform('segmentfault')
export class Segmentfault extends Base {
  headers = {}

  @catchCount()
  async getDetail(url: string): Promise<ArticleItem> {
    const { data: html } = await axios.get(`https://segmentfault.com${url}`)
    const $ = cheerio.load(html)

    const content = sitdown.HTMLToMD($('.article').html())
    const date = $('time').attr('datetime')
    const tags: string[] = []
    const title = $('#sf-article_title .text-body').text()

    $('.m-n1 .badge-tag').each(function () {
      tags.push($(this).text().replace(/\s/g, ''))
    })

    return {
      date,
      categories: [],
      content,
      title,
      tags,
    }
  }

  async getMain() {
    let page = 1
    const urls: string[] = []
    let emptyBreak = false
    while (true) {
      const { data: html } = await axios.get(
        `https://segmentfault.com/u/${
          this.config.userId
        }/articles?page=${page++}`
      )

      if (emptyBreak) {
        break
      }
      const $ = cheerio.load(html)

      const list = $('.profile-mine__content--title')

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
