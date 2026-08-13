import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axios';
import Avatar from '../common/Avatar';
import useChatStore from '../../store/useChatStore';

function NewConversationModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  const startDirectConversation = useChatStore((state) => state.startDirectConversation);
  const createGroupConversation = useChatStore((state) => state.createGroupConversation);
  const selectConversation = useChatStore((state) => state.selectConversation);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await api.get('/users', { params: { q: query } });
        setResults(data.data.users);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const toggleSelected = (user) => {
    setSelected((prev) =>
      prev.some((u) => u._id === user._id) ? prev.filter((u) => u._id !== user._id) : [...prev, user]
    );
  };

  const handleStartDirect = async (user) => {
    setIsSubmitting(true);
    setError('');
    try {
      const conversation = await startDirectConversation(user._id);
      await selectConversation(conversation._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start conversation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selected.length < 2) return;
    setIsSubmitting(true);
    setError('');
    try {
      const conversation = await createGroupConversation(
        groupName.trim(),
        selected.map((u) => u._id)
      );
      await selectConversation(conversation._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGroupMode = selected.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md animate-modal-in rounded-2xl border border-border-subtle bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-medium text-text-primary">
            {isGroupMode ? 'New group' : 'New conversation'}
          </h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        {isGroupMode && (
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className="mt-3 w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
          />
        )}

        {selected.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selected.map((u) => (
              <span
                key={u._id}
                className="flex items-center gap-1 rounded-full bg-surface-elevated px-2.5 py-1 text-xs text-text-primary"
              >
                {u.username}
                <button onClick={() => toggleSelected(u)} className="text-text-muted hover:text-danger">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username or email"
          className="mt-3 w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />

        {error && <p className="mt-2 text-xs text-danger">{error}</p>}

        <div className="mt-3 max-h-64 space-y-1 overflow-y-auto">
          {isSearching && <p className="px-2 py-2 text-sm text-text-muted">Searching…</p>}
          {!isSearching && results.length === 0 && (
            <p className="px-2 py-2 text-sm text-text-muted">No users found.</p>
          )}
          {results.map((user) => {
            const isSelected = selected.some((u) => u._id === user._id);
            return (
              <div
                key={user._id}
                className={`flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-surface-elevated ${
                  isSelected ? 'bg-surface-elevated' : ''
                }`}
              >
                <button
                  onClick={() => toggleSelected(user)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <Avatar src={user.avatar} name={user.username} size={32} online={user.isOnline} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">{user.username}</p>
                    <p className="truncate text-xs text-text-muted">{user.email}</p>
                  </div>
                  <span
                    className={`h-4 w-4 shrink-0 rounded border ${
                      isSelected ? 'border-accent bg-accent' : 'border-border-subtle'
                    }`}
                  />
                </button>
                {!isGroupMode && (
                  <button
                    onClick={() => handleStartDirect(user)}
                    className="shrink-0 text-xs font-medium text-accent hover:text-accent-hover"
                  >
                    Message
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {isGroupMode && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCreateGroup}
              disabled={isSubmitting || !groupName.trim() || selected.length < 2}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover disabled:opacity-40"
            >
              {isSubmitting ? 'Creating…' : 'Create group'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewConversationModal;
