const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

function log(level, msg) {
  const line = `[${new Date().toISOString()}] [${level}] ${msg}\n`;
  fs.appendFileSync(path.join(logDir, "server.log"), line);
  console.log(line.trim());
}

module.exports = {
  info: (msg) => log("INFO", msg),
  error: (msg) => log("ERROR", msg),
};
