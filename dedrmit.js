require("dotenv").config();
const glob = require("glob");
const util = require("util");
const path = require("path");
const expandTilde = require("expand-tilde");
const exec = util.promisify(require("child_process").exec);

import { fileExists } from "./src/lib/fs";

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
    const outputFile = `${AUDIBLE_FILES_PATH}/${name}.m4b`;
    if (!(await fileExists(outputFile))) {
      // convert file
      console.log(`\n~~~[start] converting ${name}.aax~~~~\n`);

      const convertCmd = `ffmpeg -y -activation_bytes ${AUDIBLE_ACTIVATION_BYTES} -i '${filepath}' -c:a copy -vn '${outputFile}'`;
      const { stdout, stderr } = await exec(convertCmd);
      console.log(`~~~[success] ${name}~~~~\n`);
    }
  }
};
// console.log(files);
// console.log(process.env["AUDIBLE_ACTIVATION_BYTES"]);
