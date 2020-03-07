import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fsExistsSync } from "./util";
import filenamify from "filenamify";
const generate = async (
  id: string,
  time: string,
  output: string,
  cookie: string
): Promise<void> => {
  output = path.resolve(output);
  if (!fsExistsSync(output)) {
    console.log("输出目录不存在，正在创建...");
    fs.mkdirSync(output);
  }
  const res = await fetch(
    `https://blog-console-api.csdn.net/v1/editor/getArticle?id=${id}`,
    {
      headers: {
        cookie: cookie
      }
    }
  );

  const { data, code, msg } = await res.json();
  if (code !== 200) {
    console.log(code, msg);
    return;
  }

  const {
    markdowncontent,
    content,
    tags: tagsStr,
    categories: categoriesStr,
    title
  } = data;
  let tags: string[] = []; //标签
  let categories: string[] = []; //分类

  if (tagsStr && tagsStr.length > 0) {
    tags = tagsStr.split(",");
  }

  if (categoriesStr && categoriesStr.length > 0) {
    categories = categoriesStr.split(",");
  }

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
  writeStream.write(markdowncontent || content || "");
  writeStream.end("");
};
export default generate;
