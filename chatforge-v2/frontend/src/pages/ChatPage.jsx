import { useEffect, useState } from 'react';
import ConversationList from '../components/chat/ConversationList';
import MessageThread from '../components/chat/MessageThread';
import NewConversationModal from '../components/chat/NewConversationModal';
import IncomingCallModal from '../components/calls/IncomingCallModal';
import ActiveCallView from '../components/calls/ActiveCallView';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import useCallStore from '../store/useCallStore';

function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const initSocketListeners = useChatStore((state) => state.initSocketListeners);
  const teardownSocketListeners = useChatStore((state) => state.teardownSocketListeners);
  const initCallSocketListeners = useCallStore((state) => state.initCallSocketListeners);
  const teardownCallSocketListeners = useCallStore((state) => state.teardownCallSocketListeners);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchConversations();
    initSocketListeners();
    initCallSocketListeners();
    return () => {
      teardownSocketListeners();
      teardownCallSocketListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeConversation = conversations.find((c) => c._id === activeConversationId);

  return (
    <div className="flex h-[100dvh] bg-bg">
      <aside
        className={`w-full shrink-0 flex-col border-r border-border-subtle bg-surface p-4 md:flex md:w-80 ${
          activeConversationId ? 'hidden' : 'flex'
        }`}
      >
        <div className="flex items-center justify-between pb-3">
          <span className="font-display text-lg font-medium text-text-primary">Roomtone</span>
          <button onClick={logout} className="text-sm text-text-secondary hover:text-accent">
            Log out
          </button>
        </div>
        <p className="pb-3 text-sm text-text-secondary">Signed in as {user?.username}</p>

        <div className="min-h-0 flex-1">
          <ConversationList onNewConversation={() => setIsModalOpen(true)} />
        </div>
      </aside>

      <main className={`flex-1 md:flex ${activeConversationId ? 'flex' : 'hidden'}`}>
        {activeConversation ? (
          <MessageThread conversation={activeConversation} />
        ) : (
          <div className="hidden h-full w-full items-center justify-center md:flex">
            <p className="text-text-muted">Select a conversation, or start one.</p>
          </div>
        )}
      </main>

      {isModalOpen && <NewConversationModal onClose={() => setIsModalOpen(false)} />}

      <IncomingCallModal />
      <ActiveCallView />
    </div>
  );
}

export default ChatPage;
