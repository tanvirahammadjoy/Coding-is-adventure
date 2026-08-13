import { Paperclip, Phone, Video } from 'lucide-react';
import Avatar from '../common/Avatar';
import { getConversationDisplay } from '../../lib/conversationDisplay';
import { formatRelativeShort } from '../../lib/formatTime';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';

function ConversationListItem({ conversation, isActive, onClick }) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const onlineUserIds = useChatStore((state) => state.onlineUserIds);
  const { name, avatar, isOnline } = getConversationDisplay(conversation, currentUserId, onlineUserIds);

  const lastMessage = conversation.lastMessage;
  let PreviewIcon = null;
  let previewText = 'No messages yet';
  if (lastMessage) {
    if (lastMessage.isDeleted) {
      previewText = 'Message deleted';
    } else if (lastMessage.type === 'call') {
      PreviewIcon = lastMessage.callInfo?.callType === 'video' ? Video : Phone;
      previewText = 'Call';
    } else if (lastMessage.content) {
      previewText = lastMessage.content;
    } else if (lastMessage.attachments?.length) {
      PreviewIcon = Paperclip;
      previewText = 'Attachment';
    }
  }

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
        isActive ? 'bg-surface-elevated' : 'hover:bg-surface-elevated/60'
      }`}
    >
      <Avatar
        src={avatar}
        name={name}
        size={44}
        online={conversation.type === 'direct' ? isOnline : undefined}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-medium text-text-primary">{name}</p>
          {conversation.lastMessage && (
            <span className="shrink-0 text-xs text-text-muted">
              {formatRelativeShort(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1 truncate text-sm text-text-secondary">
            {PreviewIcon && <PreviewIcon size={12} className="shrink-0" />}
            <span className="truncate">{previewText}</span>
          </p>
          {conversation.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-medium text-bg">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default ConversationListItem;
