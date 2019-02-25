import { base, output, csdn, cookies } from "../config";
import generate from "../src/generate";
import path from "path";
import { fsExistsSync } from "../src/util";
import readline from "readline";
import fs from "fs";
import { execSync } from "child_process";
// 深入Preact源码分析（四）setState发生了什么

describe("normal generate func test", () => {
  beforeAll(() => {
    const c = process.env.cookies || cookies;
    execSync(
      `node ./dist/start.js --output ${output} --csdn ${csdn} --cookies ${c}`
    );
  });

  test("test generate markdown files", () => {
    expect(
      fsExistsSync(
        path.join(output, "./深入Preact源码分析（四）setState发生了什么.md")
      )
    ).toBeTruthy();
  });

  test("title, date,tag and categories", done => {
    const arr: string[] = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(
        path.join(output, "./深入Preact源码分析（四）setState发生了什么.md")
      ),
      crlfDelay: Infinity
    });
    rl.on("line", line => {
      if (arr.length <= 5) {
        arr.push(line);
      } else {
        rl.close();
        const [begin, title, date, tags, categories, end] = arr;
        expect(begin).toBe("---");
        expect(title).toBe("title: 深入Preact源码分析（四）setState发生了什么");
        expect(date).toBe("date: 2018-04-17 21:12:04");
        expect(tags).toBe("tags: Preact 源码");
        expect(categories).toBe("categories: 前端框架");
        expect(end).toBe("---");
        done();
      }
    });
  });

  afterAll(() => {
    // execSync(`rm -rf ${output}`);
  });
});
