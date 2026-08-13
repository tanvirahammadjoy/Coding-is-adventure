import { Router } from "express";
import {
  addParticipants,
  leaveGroup,
  removeParticipant,
  updateAdminStatus,
  updateGroupInfo,
} from "../controllers/group.controller.js";
import { verifyJWT } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  addParticipantsSchema,
  updateAdminStatusSchema,
  updateGroupInfoSchema,
} from "../validations/group.validation.js";

const router = Router();
router.use(verifyJWT);

router.patch("/:id/group", validate(updateGroupInfoSchema), updateGroupInfo);
router.post(
  "/:id/participants",
  validate(addParticipantsSchema),
  addParticipants,
);
router.delete("/:id/participants/:userId", removeParticipant);
router.post("/:id/leave", leaveGroup);
router.patch(
  "/:id/admins/:userId",
  validate(updateAdminStatusSchema),
  updateAdminStatus,
);

export default router;
