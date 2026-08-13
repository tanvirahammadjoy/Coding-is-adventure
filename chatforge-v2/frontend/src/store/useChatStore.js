import { create } from 'zustand';
import api from '../api/axios';
import { socket } from '../lib/socket';

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messagesByConversation: {}, // { [conversationId]: Message[] }
  typingByConversation: {}, // { [conversationId]: Set<userId> }
  onlineUserIds: new Set(),
  isLoadingConversations: false,
  isLoadingMessages: false,
  listenersAttached: false,

  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const { data } = await api.get('/conversations');
      set({ conversations: data.data.conversations });
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  selectConversation: async (conversationId) => {
    set({ activeConversationId: conversationId });
    if (!get().messagesByConversation[conversationId]) {
      await get().fetchMessages(conversationId);
    }
    get().markConversationRead(conversationId);
  },

  clearActiveConversation: () => set({ activeConversationId: null }),

  fetchMessages: async (conversationId) => {
    set({ isLoadingMessages: true });
    try {
      const { data } = await api.get(`/messages/${conversationId}`);
      set((state) => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: data.data.messages,
        },
      }));
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  // Resolves with { message } on success or { error } on failure - the
  // message itself is never appended here. It only ever enters the store
  // via the message:new listener below, so there's one source of truth
  // whether it's this tab, another tab, or a group peer that triggered it.
  sendMessage: (conversationId, content, { replyTo = null, attachments = [] } = {}) =>
    new Promise((resolve) => {
      socket.emit('message:send', { conversationId, content, replyTo, attachments }, resolve);
    }),

  editMessage: (messageId, content) =>
    new Promise((resolve) => {
      socket.emit('message:edit', { messageId, content }, resolve);
    }),

  deleteMessage: (messageId) =>
    new Promise((resolve) => {
      socket.emit('message:delete', { messageId }, resolve);
    }),

  reactToMessage: (messageId, emoji) =>
    new Promise((resolve) => {
      socket.emit('message:react', { messageId, emoji }, resolve);
    }),

  // Fire-and-forget: marks a conversation read, both on the server and
  // optimistically here so the badge clears without waiting on a round trip.
  markConversationRead: (conversationId) => {
    socket.emit('message:read', { conversationId });
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },

  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.attachment;
  },

  startDirectConversation: async (userId) => {
    const { data } = await api.post('/conversations/direct', { userId });
    get().upsertConversation(data.data.conversation);
    return data.data.conversation;
  },

  createGroupConversation: async (groupName, participantIds) => {
    const { data } = await api.post('/conversations/group', { groupName, participantIds });
    get().upsertConversation(data.data.conversation);
    return data.data.conversation;
  },

  updateGroupInfo: async (conversationId, updates) => {
    const { data } = await api.patch(`/conversations/${conversationId}/group`, updates);
    get().upsertConversation(data.data.conversation);
    return data.data.conversation;
  },

  addParticipants: async (conversationId, participantIds) => {
    const { data } = await api.post(`/conversations/${conversationId}/participants`, {
      participantIds,
    });
    get().upsertConversation(data.data.conversation);
    return data.data.conversation;
  },

  removeParticipant: async (conversationId, userId) => {
    await api.delete(`/conversations/${conversationId}/participants/${userId}`);
    // No need to patch state here - the server broadcasts conversation:updated
    // to everyone still in the room, which includes whoever just did the
    // removing, so the socket listener below handles it.
  },

  updateAdminStatus: async (conversationId, userId, isAdminValue) => {
    const { data } = await api.patch(`/conversations/${conversationId}/admins/${userId}`, {
      isAdmin: isAdminValue,
    });
    get().upsertConversation(data.data.conversation);
    return data.data.conversation;
  },

  leaveGroupConversation: async (conversationId) => {
    await api.post(`/conversations/${conversationId}/leave`);
    get().removeConversation(conversationId);
  },

  removeConversation: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.filter((c) => c._id !== conversationId),
      activeConversationId:
        state.activeConversationId === conversationId ? null : state.activeConversationId,
    }));
  },

  upsertConversation: (conversation) => {
    set((state) => {
      const exists = state.conversations.some((c) => c._id === conversation._id);
      return {
        conversations: exists
          ? state.conversations.map((c) => (c._id === conversation._id ? conversation : c))
          : [conversation, ...state.conversations],
      };
    });
  },

  // Swaps a message in place wherever it lives - used for edits, soft
  // deletes, and reaction changes, all of which arrive as the same
  // message:updated event with the full updated message attached.
  replaceMessage: (updatedMessage) => {
    set((state) => {
      const existing = state.messagesByConversation[updatedMessage.conversation];
      if (!existing) return {};
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [updatedMessage.conversation]: existing.map((m) =>
            m._id === updatedMessage._id ? updatedMessage : m
          ),
        },
      };
    });
  },

  setTyping: (conversationId, userId, isTyping) => {
    set((state) => {
      const current = new Set(state.typingByConversation[conversationId]);
      if (isTyping) current.add(userId);
      else current.delete(userId);
      return { typingByConversation: { ...state.typingByConversation, [conversationId]: current } };
    });
  },

  initSocketListeners: () => {
    if (get().listenersAttached) return;
    set({ listenersAttached: true });

    socket.on('message:new', (message) => {
      set((state) => {
        const existing = state.messagesByConversation[message.conversation] || [];
        if (existing.some((m) => m._id === message._id)) return {};
        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [message.conversation]: [...existing, message],
          },
        };
      });

      set((state) => ({
        conversations: state.conversations
          .map((c) =>
            c._id === message.conversation
              ? {
                  ...c,
                  lastMessage: message,
                  updatedAt: message.createdAt,
                  // Only bump the badge if I'm not currently looking at
                  // this conversation - if I am, it gets marked read below.
                  unreadCount:
                    c._id === get().activeConversationId ? 0 : (c.unreadCount || 0) + 1,
                }
              : c
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
      }));

      if (message.conversation === get().activeConversationId) {
        get().markConversationRead(message.conversation);
      }
    });

    socket.on('message:updated', (message) => {
      get().replaceMessage(message);
    });

    // Mirrors the server's bulk "mark unread messages read" write, so the
    // "Seen" indicator updates live without re-fetching message history.
    socket.on('conversation:read', ({ conversationId, userId, readAt }) => {
      set((state) => {
        const messages = state.messagesByConversation[conversationId];
        if (!messages) return {};
        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: messages.map((m) => {
              if (m.sender?._id === userId) return m;
              if (m.readBy?.some((r) => r.user === userId)) return m;
              return { ...m, readBy: [...(m.readBy || []), { user: userId, readAt }] };
            }),
          },
        };
      });
    });

    socket.on('typing:update', ({ conversationId, userId, isTyping }) => {
      get().setTyping(conversationId, userId, isTyping);
    });

    socket.on('presence:initial', (onlineIds) => {
      set({ onlineUserIds: new Set(onlineIds) });
    });

    socket.on('presence:update', ({ userId, isOnline }) => {
      set((state) => {
        const next = new Set(state.onlineUserIds);
        if (isOnline) next.add(userId);
        else next.delete(userId);
        return { onlineUserIds: next };
      });
    });

    socket.on('conversation:new', (conversation) => {
      get().upsertConversation(conversation);
      // This socket didn't create the room server-side just by receiving
      // this event - it has to explicitly join, same as any other socket.
      socket.emit('conversation:join', { conversationId: conversation._id });
    });

    // Group rename/avatar/description, membership, or admin changes -
    // all arrive as the full updated conversation, same upsert as new ones.
    socket.on('conversation:updated', (conversation) => {
      get().upsertConversation(conversation);
    });

    // I've been removed from (or the last person left) a group - drop it
    // from the list and back out of it if I was looking at it.
    socket.on('conversation:removed', ({ conversationId }) => {
      get().removeConversation(conversationId);
    });
  },

  teardownSocketListeners: () => {
    socket.off('message:new');
    socket.off('message:updated');
    socket.off('conversation:read');
    socket.off('typing:update');
    socket.off('presence:initial');
    socket.off('presence:update');
    socket.off('conversation:new');
    socket.off('conversation:updated');
    socket.off('conversation:removed');
    set({ listenersAttached: false });
  },

  reset: () => {
    get().teardownSocketListeners();
    set({
      conversations: [],
      activeConversationId: null,
      messagesByConversation: {},
      typingByConversation: {},
      onlineUserIds: new Set(),
    });
  },
}));

export default useChatStore;
