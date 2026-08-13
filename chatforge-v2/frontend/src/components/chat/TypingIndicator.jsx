import useChatStore from '../../store/useChatStore';
import useAuthStore from '../../store/useAuthStore';

// Same reasoning as MessageThread's EMPTY_MESSAGES - a fresh `new Set()`
// here would be a new reference every render, which Zustand would see as
// "changed" every time, causing the exact infinite-update-depth loop this
// component used to trigger the moment a conversation with no typing
// activity was opened (i.e. almost always, on first open).
const EMPTY_TYPING_SET = new Set();

function TypingIndicator({ conversationId, participants }) {
  const typingUserIds = useChatStore(
    (state) => state.typingByConversation[conversationId] || EMPTY_TYPING_SET
  );
  const currentUserId = useAuthStore((state) => state.user?.id);

  const typingUsers = [...typingUserIds]
    .filter((id) => id !== currentUserId)
    .map((id) => participants.find((p) => p._id === id))
    .filter(Boolean);

  if (typingUsers.length === 0) {
    return <div className="h-6" />; // reserve the space so the layout doesn't jump
  }

  const label =
    typingUsers.length === 1
      ? `${typingUsers[0].username} is typing…`
      : `${typingUsers.length} people are typing…`;

  return <p className="h-6 px-4 py-1 text-xs italic text-text-muted">{label}</p>;
}

export default TypingIndicator;
