import { Router } from "express";
import { searchUsers } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.use(verifyJWT);
router.get("/", searchUsers);

export default router;
