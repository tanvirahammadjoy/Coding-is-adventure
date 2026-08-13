import { z } from "zod";

export const startDirectConversationSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const createGroupConversationSchema = z.object({
  groupName: z.string().trim().min(1, "Group name is required").max(50),
  participantIds: z.array(z.string()).min(2, "Select at least 2 other members"),
});
