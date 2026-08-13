import { Router } from "express";
import { uploadAttachment } from "../controllers/upload.controller.js";
import { verifyJWT } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import ApiError from "../utils/ApiError.js";

const router = Router();

router.use(verifyJWT);

router.post(
  "/",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) return next(new ApiError(400, err.message));
      next();
    });
  },
  uploadAttachment,
);

export default router;
