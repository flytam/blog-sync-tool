import axios from 'axios'
import { ArticleItem, Base, Config } from '../base'
import cheerio from 'cheerio'
import { Sitdown } from 'sitdown'
import { catchCount, throttle } from '../../decorator'
import { info } from '../../log'
const sitdown = new Sitdown({
  keepFilter: ['style'],
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
})

export class Csdn extends Base {
  headers = {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': ' zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'upgrade-insecure-requests': '1',
  }

  constructor(config: Config) {
    super(config)
  }

  idTimeMap = new Map<number, string>()

  async getMain() {
    const idTimeMap = this.idTimeMap
    let i = 1
    const articleIds: number[] = []
    while (true) {
      const { data: html } = await axios.get(
        `https://blog.csdn.net/${this.config.userId}/article/list/${i++}`
      )
      const $ = cheerio.load(html)

      const list = $('.article-item-box')
      if (list?.length > 0) {
        $('.article-item-box').each(function () {
          const id = $('a', this)
            .attr('href')
            .match(/(\d{1,})$/)

          if (id) {
            articleIds.push(Number(id[0]))
            idTimeMap.set(Number(id[0]), $('.date', this).text().trim())
          }
        })
      } else {
        break
      }
    }
    return articleIds
  }

  @throttle(1000)
  @catchCount()
  async getByPage(id: number): Promise<ArticleItem> {
    const { data: html } = await axios.get(
      `https://blog.csdn.net/${this.config.userId}/article/details/${id}`
    )

    const tags: string[] = [] //标签
    const categories: string[] = [] //分类

    const $ = cheerio.load(html, {
      decodeEntities: true,
    })
    const title = $('.title-article').text()
    const x = $('#content_views').html()

    // csdn一个诡异的注释<!-- flowchart 箭头图标 勿删 -->
    const commentReg = /<!-- flowchart 箭头图标 勿删 -->/
    if (!x) {
      return
    }
    const markdown = sitdown.HTMLToMD(x).replace(commentReg, '')

    $('.artic-tag-box .tag-link').each(function (i) {
      if (i === 0) {
        categories.push($(this).text())
      } else {
        tags.push($(this).text())
      }
    })

    return {
      content: markdown,
      title,
      tags,
      categories,
      date: this.idTimeMap.get(id),
    }
  }
  @throttle()
  @catchCount()
  async getByApi(id: number): Promise<ArticleItem> {
    const {
      data: {
        data: {
          markdowncontent,
          content,
          tags: tagsStr,
          categories: categoriesStr,
          title,
        },
      },
    } = await axios.get<{
      data: {
        markdowncontent: string
        content: string
        tags: string
        categories: string
        title: string
      }
      code: number
      msg: string
    }>(`https://blog-console-api.csdn.net/v1/editor/getArticle?id=${id}`)

    const tags: string[] = [] //标签
    const categories: string[] = [] //分类

    if (tagsStr?.length > 0) {
      tags.push(...tagsStr.split(','))
    }

    if (categoriesStr?.length > 0) {
      categories.push(...categoriesStr.split(','))
    }
    return {
      content: markdowncontent || content || '',
      tags,
      categories,
      title,
      date: this.idTimeMap.get(id),
    }
  }

  async run() {
    const list = await this.getMain()
    const resultList: ArticleItem[] = []
    let fn: (id: number) => Promise<ArticleItem> = null
    if (this.config.cookie) {
      info('提供cookie，使用文章api获取模式')
      fn = this.getByApi
    } else {
      info('未提供cookie 使用爬取页面模式，页面数据可能有错误')
      fn = this.getByPage
    }
    for (let id of list) {
      info(`拉取:${id}`)
      let result: ArticleItem = null
      result = await fn.call(this, id)
      resultList.push(result)
    }
    return resultList
  }
}
