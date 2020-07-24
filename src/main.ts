import generateByApi from "./generateByApi";
import generateByPage from "./generateByPage";
import cheerio from "cheerio";
import fetch from "node-fetch";
import { execSync } from "child_process";
import { headers } from "./headers";
import { configType } from "./config";
import { runTasksQueue } from "./util";
const main = async ({ csdn, output, cookie }: configType) => {
  const article: { id: string; time: string }[] = [];
  for (let i = 0; true; i++) {
    const res = await fetch(`${csdn}/article/list/${i}`, {
      headers,
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const list = $(".article-item-box");
    if (list && list.length > 0) {
      $(".article-item-box").each(function () {
        // 获取当页文章连接id
        const idResult = $("a", this)
          .attr("href")
          .match(/(\d{1,})$/);

        if (idResult) {
          article.push({
            id: idResult[0],
            time: $(".date", this).text().trim(),
          });
        }
      });
    } else {
      break;
    }
  }
  console.log("正在生成文件....");

  const p = article.map(({ id, time }) => {
    if (cookie) {
      return [generateByApi, { id, time, output, cookie }] as const;
    } else {
      return [
        generateByPage,
        {
          id,
          time,
          output,
          csdn,
        },
      ] as const;
    }
  });

  const { success, fail } = await runTasksQueue(
    p.map((x) => x[0]),
    p.map((x) => x[1])
  );
  console.log(`生成完成.....成功:${success},失败:${fail}`);
};

export default main;
