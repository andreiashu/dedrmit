require("dotenv").config();
const glob = require("glob");
const util = require("util");
const path = require("path");
const space = require("to-space-case");
const expandTilde = require("expand-tilde");
const ffmetadata = require("ffmetadata");
const exec = util.promisify(require("child_process").exec);
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  headerCase,
  noCase,
  paramCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase
} from "change-case";

import { fileExists, stringToFilename } from "./src/lib/fs";

const AUDIBLE_FILES_PATH = expandTilde(process.env["AUDIBLE_FILES_PATH"]);
const AUDIBLE_ACTIVATION_BYTES = process.env["AUDIBLE_ACTIVATION_BYTES"];

(async () => {
  process.nextTick(async () => {
    await main();
    process.exit(0);
  });
})();

const main = async () => {
  const files = glob.sync(AUDIBLE_FILES_PATH + "/**/*.aax");
  for (const filepath of files) {
    const name = path.basename(filepath, ".aax");
    const meta = await readMeta(filepath);
    const filename = `${meta.album_artist} - ${stringToFilename(meta.album)}`;
    const outputFile = `${AUDIBLE_FILES_PATH}/${filename}.m4b`;
    if (!(await fileExists(outputFile))) {
      // convert file
      const convertCmd = `ffmpeg -y -activation_bytes ${AUDIBLE_ACTIVATION_BYTES} -i '${filepath}' -c:a copy -vn '${outputFile}'`;
      const { stdout, stderr } = await exec(convertCmd);
      console.log(`~~~[success] ${name}~~~~\n`);
    }
  }
};
// console.log(files);
// console.log(process.env["AUDIBLE_ACTIVATION_BYTES"]);

const readMeta = async filepath => {
  return new Promise((resolve, reject) => {
    ffmetadata.read(filepath, function(err, data) {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};
