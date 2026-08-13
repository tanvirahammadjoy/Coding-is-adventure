import { Router } from "express";
import { getMessages } from "../controllers/message.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.use(verifyJWT);
router.get("/:conversationId", getMessages);

export default router;
