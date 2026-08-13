import { z } from "zod";

export const updateGroupInfoSchema = z
  .object({
    groupName: z
      .string()
      .trim()
      .min(1, "Group name cannot be empty")
      .max(50)
      .optional(),
    groupDescription: z.string().max(200).optional(),
    groupAvatar: z.string().url("groupAvatar must be a URL").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const addParticipantsSchema = z.object({
  participantIds: z
    .array(z.string())
    .min(1, "Select at least one person to add"),
});

export const updateAdminStatusSchema = z.object({
  isAdmin: z.boolean(),
});
