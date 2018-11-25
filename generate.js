const { csdn } = require("./config");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const TurndownService = require("turndown");
const turndownService = new TurndownService();
const fs = require("fs");
const path = require("path");

const generate = async (url, output) => {
  output = path.resolve(output);
  try {
    fs.accessSync(output, fs.constants.W_OK);
  } catch (err) {
    // 不存在
    console.log("输出目录不存在，正在创建...");
    fs.mkdirSync(output);
  }
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const htmlcontent = $(".markdown_views").html();

  const markdown = turndownService.turndown(htmlcontent || "");
  const time = $(".time")
    .text()
    .replace(/([\u4e00-\u9fa5])/g, "-")
    .replace(/\-\s/, " "); //时间格式化
  const title = $(".title-article").text();
  const tags = []; //标签
  const categories = []; //分类
  $(".tag-link").each(function() {
    const content = $(this)
      .text()
      .replace(/\t/g, "");
    if (
      /^(https|http):\/\/so.csdn.net\/so\/search\//.test($(this).attr("href"))
    ) {
      // 标签
      tags.push(content);
    } else {
      categories.push(content);
    }
  });
  const writeStream = fs.createWriteStream(
    path.join(output, `./${title}.md`),
    "utf8"
  );
  writeStream.write("---\n");
  writeStream.write(`title: ${title}\n`);
  writeStream.write(`date: ${time}\n`);
  writeStream.write(`tags: ${tags.join(" ")}\n`);
  writeStream.write(`categories: ${categories.join(" ")}\n`);
  writeStream.write("---\n\n");
  writeStream.write("<!--more-->\n\n");
  writeStream.write(markdown);
  writeStream.end("");
};

module.exports = generate;
