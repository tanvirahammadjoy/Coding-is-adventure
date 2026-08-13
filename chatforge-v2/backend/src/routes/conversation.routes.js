import { Router } from "express";
import {
  createGroupConversation,
  getConversationById,
  getConversations,
  startDirectConversation,
} from "../controllers/conversation.controller.js";
import { verifyJWT } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  createGroupConversationSchema,
  startDirectConversationSchema,
} from "../validations/conversation.validation.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getConversations);
router.get("/:id", getConversationById);
router.post(
  "/direct",
  validate(startDirectConversationSchema),
  startDirectConversation,
);
router.post(
  "/group",
  validate(createGroupConversationSchema),
  createGroupConversation,
);

export default router;
