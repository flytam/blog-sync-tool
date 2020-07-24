import fs from "fs";
export const fsExistsSync = (way: string): boolean => {
  try {
    fs.accessSync(way, fs.constants.W_OK);
  } catch (e) {
    return false;
  }
  return true;
};

export async function delay(ms = 200) {
  return new Promise((res) => {
    setTimeout(() => res(), ms);
  });
}
// 每10个一批
export const runTasksQueue = async function <
  T extends (params: any) => Promise<void>
>(fns: T[], fnParams: Parameters<T>[0][], limit = 10) {
  let success = 0;
  let fail = 0;
  while (fnParams.length > 0) {
    const runParams = fnParams.splice(0, limit);
    await Promise.all(
      runParams.map(async (param, i) => {
        try {
          await fns[i](param);
          success++;
        } catch {
          fail++;
        }
      })
    );
  }
  return {
    success,
    fail,
  };
};
