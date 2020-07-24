import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import cheerio from "cheerio";
import { fsExistsSync, delay } from "./util";
import filenamify from "filenamify";
import { generateParams } from "./config";
import { Sitdown } from "sitdown";
import { headers } from "./headers";
const sitdown = new Sitdown({
  keepFilter: ["style"],
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  hr: "---",
});

const generateByPage = async (params: generateParams & { csdn: string }) => {
  //
  let writeStream: fs.WriteStream = null;
  let { output, time, id, csdn } = params;

  output = path.resolve(output);
  if (!fsExistsSync(output)) {
    console.log("输出目录不存在，正在创建...");
    fs.mkdirSync(output);
  }
  try {
    const html = await fetch(`${csdn}/article/details/${id}`, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
      },
    }).then((res) => res.text());

    let tags: string[] = []; //标签...爬虫获取不到标签
    let categories: string[] = []; //分类

    const $ = cheerio.load(html, {
      decodeEntities: true,
    });
    const title = $(".title-article").text();
    const x = $("#content_views").html();

    // csdn一个诡异的注释<!-- flowchart 箭头图标 勿删 -->
    const commentReg = /<!-- flowchart 箭头图标 勿删 -->/;
    if (!x) {
      return;
    }
    const markdown = sitdown.HTMLToMD(x).replace(commentReg, "");

    categories.push($(".tag-link").text().replace(/\s/g, ""));

    writeStream = fs.createWriteStream(
      path.join(output, `./${filenamify(title)}.md`),
      "utf8"
    );
    console.log("生成", title);
    writeStream.write("---\n");
    writeStream.write(`title: ${title}\n`);
    writeStream.write(`date: ${time}\n`);
    writeStream.write(`tags: ${tags.join(" ")}\n`);
    writeStream.write(`categories: ${categories.join(" ")}\n`);
    writeStream.write("---\n\n");
    writeStream.write("<!--more-->\n\n");
    writeStream.write(markdown || "");
    writeStream.end("");
  } catch (e) {
    console.log(`出错: ${id}`, e);
  } finally {
    if (writeStream) {
      writeStream.close();
    }
  }
};

export default generateByPage;
