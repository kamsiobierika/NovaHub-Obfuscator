const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { obfuscateLua } = require("./api/obfuscate");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (css, js, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Set up file uploads
const upload = multer({ dest: "uploads/" });

// Route: homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Route: handle obfuscation
app.post("/api/obfuscate", upload.single("file"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = path.join("uploads", `${req.file.filename}_obf.lua`);

    const result = await obfuscateLua(inputPath, outputPath);

    res.json({
      success: true,
      download: `/download/${path.basename(outputPath)}`,
      log: result.log,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.error || "Obfuscation failed",
    });
  }
});

// Route: serve obfuscated file
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  res.download(filePath, "obfuscated.lua");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
