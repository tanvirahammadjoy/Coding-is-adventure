import { useState } from 'react';
import { Smile, Reply, Pencil, Trash2, Paperclip, Phone, Video } from 'lucide-react';
import Avatar from '../common/Avatar';
import { formatMessageTimestamp, formatCallDuration } from '../../lib/formatTime';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';

// Reactions stay as real emoji, not icon glyphs - that's the universal
// convention (WhatsApp, Slack, iMessage) and swapping them for a lucide
// icon set would actually look less correct here, not more polished.
const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

function MessageBubble({
  message,
  isOwn,
  showSenderName,
  isLastOwnMessage,
  otherParticipantId,
  onReply,
  onEdit,
}) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const reactToMessage = useChatStore((state) => state.reactToMessage);
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  if (message.type === 'call') {
    const { callType, status, durationSeconds } = message.callInfo || {};
    const CallIcon = callType === 'video' ? Video : Phone;
    const label =
      status === 'completed'
        ? `${callType === 'video' ? 'Video' : 'Voice'} call · ${formatCallDuration(durationSeconds)}`
        : status === 'missed'
          ? `Missed ${callType === 'video' ? 'video' : 'voice'} call`
          : `${callType === 'video' ? 'Video' : 'Voice'} call declined`;

    return (
      <div className={`animate-message-in flex items-center gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
        {!isOwn && <Avatar src={message.sender?.avatar} name={message.sender?.username} size={28} />}
        <div className="flex items-center gap-1.5 rounded-2xl bg-surface-elevated px-3.5 py-2 text-sm text-text-secondary">
          <CallIcon size={14} />
          <span>{label}</span>
        </div>
      </div>
    );
  }

  if (message.isDeleted) {
    return (
      <div className={`animate-message-in flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
        {!isOwn && <Avatar src={message.sender?.avatar} name={message.sender?.username} size={28} />}
        <div className="rounded-2xl bg-surface-elevated px-3.5 py-2 text-sm italic text-text-muted">
          Message deleted
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Delete this message?')) {
      deleteMessage(message._id);
    }
  };

  // "Seen" only ever shows under the *last* message I sent in a direct
  // conversation - same convention as WhatsApp/iMessage, not per-message.
  const isSeenByOther =
    isLastOwnMessage &&
    otherParticipantId &&
    message.readBy?.some((r) => r.user === otherParticipantId);

  const groupedReactions = Object.values(
    (message.reactions || []).reduce((acc, r) => {
      if (!acc[r.emoji]) acc[r.emoji] = { emoji: r.emoji, count: 0, reactedByMe: false };
      acc[r.emoji].count += 1;
      if (r.user === currentUserId) acc[r.emoji].reactedByMe = true;
      return acc;
    }, {})
  );

  return (
    <div className={`animate-message-in group flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && <Avatar src={message.sender?.avatar} name={message.sender?.username} size={28} />}
      <div className={`flex max-w-[70%] flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {showSenderName && !isOwn && (
          <span className="mb-0.5 px-1 text-xs text-text-muted">{message.sender?.username}</span>
        )}

        <div className={`flex items-center gap-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <div className="flex flex-col gap-1">
            {message.replyTo && (
              <div className="rounded-lg border-l-2 border-accent/60 bg-black/10 px-2 py-1 text-xs text-text-muted">
                {message.replyTo.isDeleted ? 'Message deleted' : message.replyTo.content}
              </div>
            )}

            {message.attachments?.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {message.attachments.map((att, i) =>
                  att.type === 'image' ? (
                    <img
                      key={i}
                      src={att.url}
                      alt={att.fileName}
                      className="max-h-64 rounded-xl object-cover"
                    />
                  ) : (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-surface-elevated px-3 py-2 text-xs text-accent hover:underline"
                    >
                      <Paperclip size={12} />
                      {att.fileName}
                    </a>
                  )
                )}
              </div>
            )}

            {message.content && (
              <div
                className={`rounded-2xl px-3.5 py-2 text-sm ${
                  isOwn
                    ? 'rounded-br-sm bg-accent text-bg'
                    : 'rounded-bl-sm bg-surface-elevated text-text-primary'
                }`}
              >
                {message.content}
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="relative">
              <button
                onClick={() => setShowReactionPicker((v) => !v)}
                className="rounded-full p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary"
                title="React"
              >
                <Smile size={15} />
              </button>
              {showReactionPicker && (
                <div className="absolute bottom-full z-10 mb-1 flex gap-0.5 rounded-full border border-border-subtle bg-surface px-1.5 py-1 shadow-lg">
                  {QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        reactToMessage(message._id, emoji);
                        setShowReactionPicker(false);
                      }}
                      className="rounded-full p-1 text-base hover:bg-surface-elevated"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={onReply}
              className="rounded-full p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary"
              title="Reply"
            >
              <Reply size={15} />
            </button>
            {isOwn && (
              <button
                onClick={onEdit}
                className="rounded-full p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
            )}
            {isOwn && (
              <button
                onClick={handleDelete}
                className="rounded-full p-1 text-text-muted hover:bg-surface-elevated hover:text-danger"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {groupedReactions.length > 0 && (
          <div className={`mt-1 flex gap-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
            {groupedReactions.map(({ emoji, count, reactedByMe }) => (
              <button
                key={emoji}
                onClick={() => reactToMessage(message._id, emoji)}
                className={`flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs ${
                  reactedByMe
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-subtle bg-surface-elevated text-text-secondary'
                }`}
              >
                <span>{emoji}</span>
                <span>{count}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-0.5 flex items-center gap-1 px-1 text-xs text-text-muted">
          <span>{formatMessageTimestamp(message.createdAt)}</span>
          {message.isEdited && <span>(edited)</span>}
          {isSeenByOther && <span>· Seen</span>}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
