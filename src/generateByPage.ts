import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import cheerio from "cheerio";
import { fsExistsSync } from "./util";
import filenamify from "filenamify";
import { generateParams } from "./config";
import { Sitdown } from "sitdown";

const sitdown = new Sitdown({
  keepFilter: ["style"],
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  hr: "---",
});

const generateByPage = async (params: generateParams) => {
  //
  let { output, time, id } = params;

  output = path.resolve(output);
  if (!fsExistsSync(output)) {
    console.log("输出目录不存在，正在创建...");
    fs.mkdirSync(output);
  }
  const html = await fetch(
    `https://blog.csdn.net/flytam/article/details/${id}`,
    {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
      },
    }
  ).then((res) => res.text());

  let tags: string[] = []; //标签...爬虫获取不到标签
  let categories: string[] = []; //分类

  const $ = cheerio.load(html, {
    decodeEntities: true,
  });
  const title = $(".title-article").text();
  const x = $("#content_views").html();

  // csdn一个诡异的注释<!-- flowchart 箭头图标 勿删 -->
  const commentReg = /<!-- flowchart 箭头图标 勿删 -->/;
  const markdown = sitdown.HTMLToMD(x).replace(commentReg, "");

  categories.push($(".tag-link").text().replace(/\s/g, ""));

  const writeStream = fs.createWriteStream(
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
};

export default generateByPage;
