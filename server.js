require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static("public"));

// File upload setup
const upload = multer({ dest: "uploads/" });

// Upload + obfuscate endpoint
app.post("/obfuscate", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const inputPath = path.join(__dirname, req.file.path);
  const outputPath = inputPath + ".obf.lua";

  // Run Lua obfuscator (main.lua is your entrypoint)
  const command = `luajit ./lua/main.lua ${inputPath} ${outputPath}`;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).send("Obfuscation failed.");
    }

    res.download(outputPath, "obfuscated.lua", (err) => {
      if (err) console.error("Download error:", err);

      // Cleanup
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Running on port ${PORT}`);
});
