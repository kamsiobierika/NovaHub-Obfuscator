const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const obfuscate = require("./obfuscate");
const logger = require("./logger");

const app = express();
const PORT = process.env.PORT || 3000;

// File upload config
const upload = multer({ dest: path.join(__dirname, "../uploads/") });

app.use(express.static(path.join(__dirname, "../public")));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs"); // optional if you want templating, else just serve HTML

// Landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

// Upload page
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/upload.html"));
});

// Handle upload + obfuscation
app.post("/obfuscate", upload.single("luaFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, "../output/", req.file.originalname);

    await obfuscate(inputPath, outputPath);

    logger.info(`Obfuscated: ${req.file.originalname}`);

    res.render(path.join(__dirname, "../views/result.html"), {
      file: `/output/${req.file.originalname}`,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send("Obfuscation failed");
  }
});

app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});
