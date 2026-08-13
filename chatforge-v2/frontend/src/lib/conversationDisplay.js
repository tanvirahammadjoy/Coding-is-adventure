// Direct conversations don't store their own name/avatar - they're
// derived from "whichever participant isn't me". Group conversations
// carry their own. Online status comes from the live onlineUserIds set
// in useChatStore, not the participant snapshot, which goes stale the
// moment someone's presence changes after the conversation was fetched.
export const getConversationDisplay = (conversation, currentUserId, onlineUserIds) => {
  if (conversation.type === 'group') {
    return {
      name: conversation.groupName || 'Group',
      avatar: conversation.groupAvatar,
      isOnline: undefined,
    };
  }

  const other = conversation.participants.find((p) => p._id !== currentUserId);
  return {
    name: other?.username || 'Unknown user',
    avatar: other?.avatar,
    isOnline: other ? onlineUserIds.has(other._id) : false,
    otherUserId: other?._id,
  };
};
