const multer = require("multer");

// Store files in memory (not disk) so we can upload directly to S3
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 35 * 1024 * 1024 }, // limit 35MB
  fileFilter: (req, file, cb) => {
    // ✅ Fixed: Check if mimetype STARTS WITH "image/"
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  },
});

module.exports = upload;
