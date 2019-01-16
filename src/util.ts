import fs from "fs";
export const fsExistsSync = (way: string): boolean => {
  try {
    fs.accessSync(way, fs.constants.W_OK);
  } catch (e) {
    return false;
  }
  return true;
};
