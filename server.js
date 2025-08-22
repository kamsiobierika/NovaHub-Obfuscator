require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// EJS or HTML rendering (we’ll just serve plain HTML templates in /views)
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// File upload setup
const upload = multer({ dest: "uploads/" });

// Landing page
app.get("/", (req, res) => {
  res.render("index.html");
});

// Upload form
app.get("/upload", (req, res) => {
  res.render("upload.html");
});

// Upload + obfuscate endpoint
app.post("/obfuscate", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("❌ No file uploaded.");

  const inputPath = path.join(__dirname, req.file.path);
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}.obf.lua`
  );

  // Run Lua obfuscator (entry is prometheus.lua)
  const command = `./bin/luajit ./lua/prometheus.lua ${inputPath} ${outputPath}`;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Obfuscator Error:", stderr);
      return res.status(500).send("❌ Obfuscation failed.");
    }

    // Show result page with download link
    res.render("result.html", {
      downloadLink: `/download/${req.file.filename}.obf.lua`,
    });
  });
});

// Download obfuscated file
app.get("/download/:file", (req, res) => {
  const filePath = path.join(__dirname, "output", req.params.file);

  res.download(filePath, "obfuscated.lua", (err) => {
    if (err) console.error("Download error:", err);

    // Cleanup uploaded + obfuscated files after sending
    try {
      fs.unlinkSync(filePath);
      const original = path.join(
        __dirname,
        "uploads",
        req.params.file.replace(".obf.lua", "")
      );
      if (fs.existsSync(original)) fs.unlinkSync(original);
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }
  });
});

app.listen(PORT, () => {
  console.log(`[SERVER] 🚀 Running on port ${PORT}`);
});
