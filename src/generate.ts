import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fsExistsSync } from "./util";

const generate = async (
  id: string,
  time: string,
  output: string,
  cookies: string
): Promise<void> => {
  output = path.resolve(output);
  if (!fsExistsSync(output)) {
    console.log("输出目录不存在，正在创建...");
    fs.mkdirSync(output);
  }
  const res = await fetch(`https://mp.csdn.net/mdeditor/getArticle?id=${id}`, {
    headers: {
      cookie: cookies
    }
  });

  const {
    data: { markdowncontent, tags: tagsStr, categories: categoriesStr, title }
  } = await res.json();

  let tags: string[] = []; //标签
  let categories: string[] = []; //分类

  if (tagsStr && tagsStr.length > 0) {
    tags = tagsStr.split(",");
  }

  if (categoriesStr && categoriesStr.length > 0) {
    categories = categoriesStr.split(",");
  }

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
  writeStream.write(markdowncontent || "");
  writeStream.end("");
};
export default generate;
