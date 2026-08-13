import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Cloudinary only has 'image', 'video', and 'raw' resource types - audio
// rides under 'video'. Our own `type` field is what the UI actually
// branches on (image preview vs. generic file download link, etc).
const classifyFile = (mimetype) => {
  if (mimetype.startsWith("image/"))
    return { type: "image", resourceType: "image" };
  if (mimetype.startsWith("video/"))
    return { type: "video", resourceType: "video" };
  if (mimetype.startsWith("audio/"))
    return { type: "audio", resourceType: "video" };
  return { type: "file", resourceType: "raw" };
};

export const uploadAttachment = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file provided");

  const { type, resourceType } = classifyFile(req.file.mimetype);

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "chatforge-v2" },
      (error, uploaded) => (error ? reject(error) : resolve(uploaded)),
    );
    stream.end(req.file.buffer);
  });

  const attachment = {
    url: result.secure_url,
    publicId: result.public_id,
    type,
    fileName: req.file.originalname,
    fileSize: req.file.size,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, { attachment }, "File uploaded"));
});
