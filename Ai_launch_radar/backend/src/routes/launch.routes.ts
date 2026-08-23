import { Router } from "express";
import { launchController } from "../controllers/launch.controller";

const router = Router();

router.get("/", launchController.list);
router.get("/:id", launchController.getById);

export default router;
