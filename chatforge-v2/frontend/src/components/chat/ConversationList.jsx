import { Plus } from 'lucide-react';
import ConversationListItem from './ConversationListItem';
import useChatStore from '../../store/useChatStore';

function ConversationList({ onNewConversation }) {
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const selectConversation = useChatStore((state) => state.selectConversation);
  const isLoading = useChatStore((state) => state.isLoadingConversations);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-1 pb-3">
        <h2 className="font-display text-lg font-medium text-text-primary">Chats</h2>
        <button
          onClick={onNewConversation}
          className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-bg hover:bg-accent-hover"
        >
          <Plus size={15} />
          New
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {isLoading && conversations.length === 0 && (
          <p className="px-3 py-4 text-sm text-text-muted">Loading conversations…</p>
        )}
        {!isLoading && conversations.length === 0 && (
          <p className="px-3 py-4 text-sm text-text-muted">
            No conversations yet. Start one to get going.
          </p>
        )}
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation._id}
            conversation={conversation}
            isActive={conversation._id === activeConversationId}
            onClick={() => selectConversation(conversation._id)}
          />
        ))}
      </div>
    </div>
  );
}

export default ConversationList;
