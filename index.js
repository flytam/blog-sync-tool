const { csdn,output } = require("./config");
const fetch = require("node-fetch");
const cheerio = require('cheerio');
const generate = require('./generate')
const main = async () => {
    const articleList = [];

    for (let i = 0; true; i++) {
        const res = await fetch(`${csdn}/article/list/${i}`);
        const html = await res.text();
        const $ = cheerio.load(html)
        const list = $('.article-item-box');
        if (list.length > 0) {
            $('.article-item-box').each(function () {
                // 获取当页文章连接
                articleList.push($('a', this).attr('href'))
            });
        } else {
            break;
        }
    }
    console.log('正在生成文件....')
    const p = articleList.map(link => generate(link,output));

    await Promise.all(p)
    console.log('生成完成')

}

main()