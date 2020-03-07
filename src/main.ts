import generate from "./generate";
import cheerio from "cheerio";
import fetch from "node-fetch";
import { execSync } from "child_process";
import { configType } from "./config";
const main = async ({
  csdn,
  output,
  base,
  cookie
}: configType): Promise<void> => {
  const article: { id: string; time: string }[] = [];
  for (let i = 0; true; i++) {
    const res = await fetch(`${csdn}/article/list/${i}`, {});
    const html = await res.text();
    const $ = cheerio.load(html);
    const list = $(".article-item-box");
    if (list && list.length > 0) {
      $(".article-item-box").each(function() {
        // 获取当页文章连接id
        const idResult = $("a", this)
          .attr("href")
          .match(/(\d{1,})$/);

        if (idResult) {
          article.push({
            id: idResult[0],
            time: $(".date", this)
              .text()
              .trim()
          });
        }
      });
    } else {
      break;
    }
  }
  console.log("正在生成文件....");
  const p = article.map(({ id, time }) => generate(id, time, output, cookie));

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

export default main;
