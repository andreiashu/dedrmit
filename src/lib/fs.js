import * as fs from "fs";
import * as tmp from "tmp";
import * as path from "path";

tmp.setGracefulCleanup();

export const fileExists = path => {
  return new Promise((resolve, reject) => {
    // Check if the file exists and is readable
    fs.access(path, fs.constants.R_OK, err => {
      resolve(err ? 0 : 1);
    });
  });
};

/**
 *
 * @param {string} ext
 *   extension: should contain the '.' - ex .png
 */
export const createTmpFile = (ext = null) => {
  return new Promise((resolve, reject) => {
    tmp.tmpName((err, tmpPath, fd, cleanupCb) => {
      if (err) {
        return reject(err);
      }

      if (`${ext}` === "") {
        return tmpPath;
      }

      const extension = `${ext}`.indexOf(".") !== -1 ? ext : `.${ext}`;
      return resolve(`${tmpPath}${extension}`);
    });
  });
};

export const stringToFilename = s => {
  return s
    .trim()
    .replace(/[^a-zA-Z0-9-_\s]/gm, "")
    .replace(/\s+/g, " ")
    .substring(0, 200);
};

export const fileExtension = s => {
  return path.extname(`${s}`).slice(1);
};
