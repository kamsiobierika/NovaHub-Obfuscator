const { exec } = require("child_process");
const path = require("path");

module.exports = function obfuscate(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const luaExe = path.join(__dirname, "../bin/luajit.exe");
    const script = path.join(__dirname, "../lua/cli.lua");

    const cmd = `"${luaExe}" "${script}" "${inputPath}" "${outputPath}"`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        return reject(stderr || err.message);
      }
      resolve(stdout);
    });
  });
};
