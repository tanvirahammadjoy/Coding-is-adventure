import { useState } from 'react';
import { X, Pencil } from 'lucide-react';
import Avatar from '../common/Avatar';
import api from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';

function GroupInfoPanel({ conversation, onClose }) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const updateGroupInfo = useChatStore((state) => state.updateGroupInfo);
  const addParticipants = useChatStore((state) => state.addParticipants);
  const removeParticipant = useChatStore((state) => state.removeParticipant);
  const updateAdminStatus = useChatStore((state) => state.updateAdminStatus);
  const leaveGroupConversation = useChatStore((state) => state.leaveGroupConversation);

  const [groupName, setGroupName] = useState(conversation.groupName || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [addQuery, setAddQuery] = useState('');
  const [addResults, setAddResults] = useState([]);
  const [isAddingMember, setIsAddingMember] = useState(false);

  // admins is never populated by the backend - always raw id strings -
  // so a plain includes() is correct here, no shape-guessing needed.
  const isCurrentUserAdmin = conversation.admins?.includes(currentUserId);

  const handleSaveName = async () => {
    if (!groupName.trim()) return;
    setIsSavingName(true);
    setError('');
    try {
      await updateGroupInfo(conversation._id, { groupName: groupName.trim() });
      setIsEditingName(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update name');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsUploadingAvatar(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await updateGroupInfo(conversation._id, { groupAvatar: data.data.attachment.url });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member from the group?')) return;
    setError('');
    try {
      await removeParticipant(conversation._id, userId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleToggleAdmin = async (userId, currentlyAdmin) => {
    setError('');
    try {
      await updateAdminStatus(conversation._id, userId, !currentlyAdmin);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admin status');
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Leave this group?')) return;
    await leaveGroupConversation(conversation._id);
    onClose();
  };

  const searchAddCandidates = async (q) => {
    setAddQuery(q);
    if (!q.trim()) {
      setAddResults([]);
      return;
    }
    const { data } = await api.get('/users', { params: { q } });
    setAddResults(
      data.data.users.filter((u) => !conversation.participants.some((p) => p._id === u._id))
    );
  };

  const handleAddMember = async (userId) => {
    setIsAddingMember(true);
    setError('');
    try {
      await addParticipants(conversation._id, [userId]);
      setAddQuery('');
      setAddResults([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setIsAddingMember(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[85vh] w-full max-w-md animate-modal-in overflow-y-auto rounded-2xl border border-border-subtle bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-medium text-text-primary">Group info</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <label className={isCurrentUserAdmin ? 'relative cursor-pointer' : 'relative'}>
            <Avatar src={conversation.groupAvatar} name={conversation.groupName} size={72} />
            {isCurrentUserAdmin && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
                <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-bg">
                  {isUploadingAvatar ? (
                    <span className="text-xs">…</span>
                  ) : (
                    <Pencil size={12} />
                  )}
                </span>
              </>
            )}
          </label>

          {isEditingName ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="rounded-lg border border-border-subtle bg-surface-elevated px-2 py-1 text-sm text-text-primary outline-none focus:border-accent"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                disabled={isSavingName}
                className="text-xs font-medium text-accent hover:text-accent-hover"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setGroupName(conversation.groupName || '');
                }}
                className="text-xs text-text-muted hover:text-text-primary"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => isCurrentUserAdmin && setIsEditingName(true)}
              className="flex items-center gap-1.5 font-medium text-text-primary"
            >
              {conversation.groupName}
              {isCurrentUserAdmin && <Pencil size={11} className="text-text-muted" />}
            </button>
          )}

          <p className="text-xs text-text-muted">{conversation.participants.length} members</p>
        </div>

        {error && <p className="mt-3 text-center text-xs text-danger">{error}</p>}

        {isCurrentUserAdmin && (
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-medium text-text-secondary">Add members</p>
            <input
              type="text"
              value={addQuery}
              onChange={(e) => searchAddCandidates(e.target.value)}
              placeholder="Search by username or email"
              className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            {addResults.length > 0 && (
              <div className="mt-1.5 max-h-32 space-y-1 overflow-y-auto">
                {addResults.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => handleAddMember(u._id)}
                    disabled={isAddingMember}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-surface-elevated"
                  >
                    <Avatar src={u.avatar} name={u.username} size={24} />
                    <span className="text-sm text-text-primary">{u.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-medium text-text-secondary">Members</p>
          <div className="space-y-1">
            {conversation.participants.map((p) => {
              const participantIsAdmin = conversation.admins?.includes(p._id);
              return (
                <div key={p._id} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                  <Avatar src={p.avatar} name={p.username} size={32} online={p.isOnline} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-text-primary">
                      {p.username} {p._id === currentUserId && '(you)'}
                    </p>
                    {participantIsAdmin && <p className="text-xs text-accent">Admin</p>}
                  </div>
                  {isCurrentUserAdmin && p._id !== currentUserId && (
                    <div className="flex shrink-0 gap-2 text-xs">
                      <button
                        onClick={() => handleToggleAdmin(p._id, participantIsAdmin)}
                        className="text-text-muted hover:text-text-primary"
                      >
                        {participantIsAdmin ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        onClick={() => handleRemove(p._id)}
                        className="text-text-muted hover:text-danger"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleLeave}
          className="mt-5 w-full rounded-lg border border-danger/40 py-2 text-sm font-medium text-danger hover:bg-danger/10"
        >
          Leave group
        </button>
      </div>
    </div>
  );
}

export default GroupInfoPanel;
