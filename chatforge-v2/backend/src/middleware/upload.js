import multer from "multer";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

// Memory storage, not disk - files pass straight through to Cloudinary's
// upload stream and are never written to this server's filesystem.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

export default upload;
