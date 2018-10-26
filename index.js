const fetch = require("node-fetch");
const cheerio = require("cheerio");
const generate = require("./generate");
const { execSync } = require("child_process");
const main = async ({ csdn, output, base }) => {
  const articleList = [];

  for (let i = 0; true; i++) {
    const res = await fetch(`${csdn}/article/list/${i}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const list = $(".article-item-box");
    if (list.length > 0) {
      $(".article-item-box").each(function() {
        // 获取当页文章连接
        articleList.push($("a", this).attr("href"));
      });
    } else {
      break;
    }
  }
  console.log("正在生成文件....");
  const p = articleList.map(link => generate(link, output));

  await Promise.all(p);
  console.log("生成完成.....");
  if (base) {
    console.log("准备进行hexo部署.....");
    try {
      execSync("hexo g", { cwd: base });
      console.log("生成静态文件成功....");
      execSync("hexo d", { cwd: base });
      console.log("部署成功....");
    } catch (e) {
      console.log(e);
    }
  }
};

module.exports = main;
