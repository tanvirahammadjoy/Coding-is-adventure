import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Phone, Video } from 'lucide-react';
import Avatar from '../common/Avatar';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import GroupInfoPanel from './GroupInfoPanel';
import { getConversationDisplay } from '../../lib/conversationDisplay';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import useCallStore from '../../store/useCallStore';

// A fresh `[]` inside the selector below would be a *new* array reference
// every render. Zustand compares selector results by reference, so that
// alone triggers a re-render, which calls the selector again, which
// creates another new `[]` - an infinite loop, which is exactly the
// "Maximum update depth exceeded" error this file used to cause.
const EMPTY_MESSAGES = [];

function MessageThread({ conversation }) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const onlineUserIds = useChatStore((state) => state.onlineUserIds);
  const messages = useChatStore((state) => state.messagesByConversation[conversation._id] || EMPTY_MESSAGES);
  const isLoading = useChatStore((state) => state.isLoadingMessages);
  const clearActiveConversation = useChatStore((state) => state.clearActiveConversation);
  const startCall = useCallStore((state) => state.startCall);
  const isCallActive = useCallStore((state) => Boolean(state.activeCall));
  const bottomRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);

  const { name, avatar, isOnline, otherUserId } = getConversationDisplay(
    conversation,
    currentUserId,
    onlineUserIds
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  // Switching conversations should drop any in-progress reply/edit draft
  // for the one we just left, and close a stale info panel.
  useEffect(() => {
    setReplyingTo(null);
    setEditingMessage(null);
    setIsGroupInfoOpen(false);
  }, [conversation._id]);

  const lastOwnMessageId = [...messages].reverse().find((m) => m.sender?._id === currentUserId)?._id;

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex items-center gap-3 border-b border-border-subtle px-4 py-3 ${
          conversation.type === 'group' ? 'cursor-pointer hover:bg-surface-elevated/40' : ''
        }`}
        onClick={() => conversation.type === 'group' && setIsGroupInfoOpen(true)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            clearActiveConversation();
          }}
          className="rounded-full p-1.5 text-text-secondary hover:bg-surface-elevated hover:text-text-primary md:hidden"
          title="Back to conversations"
        >
          <ArrowLeft size={20} />
        </button>
        <Avatar
          src={avatar}
          name={name}
          size={36}
          online={conversation.type === 'direct' ? isOnline : undefined}
        />
        <div>
          <p className="font-medium text-text-primary">{name}</p>
          {conversation.type === 'direct' && (
            <p className="text-xs text-text-muted">{isOnline ? 'Online' : 'Offline'}</p>
          )}
          {conversation.type === 'group' && (
            <p className="text-xs text-text-muted">{conversation.participants.length} members</p>
          )}
        </div>
        <div className="ml-auto flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startCall(conversation._id, 'audio', conversation.type === 'group');
            }}
            disabled={isCallActive}
            className="rounded-full p-2 text-text-secondary hover:bg-surface-elevated hover:text-text-primary disabled:opacity-40"
            title="Voice call"
          >
            <Phone size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              startCall(conversation._id, 'video', conversation.type === 'group');
            }}
            disabled={isCallActive}
            className="rounded-full p-2 text-text-secondary hover:bg-surface-elevated hover:text-text-primary disabled:opacity-40"
            title="Video call"
          >
            <Video size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {isLoading && messages.length === 0 && (
          <p className="text-center text-sm text-text-muted">Loading messages…</p>
        )}
        {!isLoading && messages.length === 0 && (
          <p className="text-center text-sm text-text-muted">No messages yet. Say hello.</p>
        )}
        {messages.map((message, i) => (
          <MessageBubble
            key={message._id}
            message={message}
            isOwn={message.sender?._id === currentUserId}
            showSenderName={
              conversation.type === 'group' && message.sender?._id !== messages[i - 1]?.sender?._id
            }
            isLastOwnMessage={message._id === lastOwnMessageId}
            otherParticipantId={conversation.type === 'direct' ? otherUserId : null}
            onReply={() => {
              setEditingMessage(null);
              setReplyingTo(message);
            }}
            onEdit={() => {
              setReplyingTo(null);
              setEditingMessage(message);
            }}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <TypingIndicator conversationId={conversation._id} participants={conversation.participants} />
      <MessageInput
        conversationId={conversation._id}
        replyingTo={replyingTo}
        editingMessage={editingMessage}
        onCancelReply={() => setReplyingTo(null)}
        onCancelEdit={() => setEditingMessage(null)}
      />

      {isGroupInfoOpen && (
        <GroupInfoPanel conversation={conversation} onClose={() => setIsGroupInfoOpen(false)} />
      )}
    </div>
  );
}

export default MessageThread;
