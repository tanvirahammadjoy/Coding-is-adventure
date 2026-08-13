import { useState, useRef, useEffect } from 'react';
import { Paperclip } from 'lucide-react';
import { socket } from '../../lib/socket';
import useChatStore from '../../store/useChatStore';

const TYPING_STOP_DELAY = 2000;
const MAX_ATTACHMENT_SIZE = 15 * 1024 * 1024; // matches the backend's multer limit

function MessageInput({ conversationId, replyingTo, editingMessage, onCancelReply, onCancelEdit }) {
  const [content, setContent] = useState('');
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const sendMessage = useChatStore((state) => state.sendMessage);
  const editMessage = useChatStore((state) => state.editMessage);
  const uploadAttachment = useChatStore((state) => state.uploadAttachment);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingMessage) setContent(editingMessage.content);
  }, [editingMessage]);

  const stopTyping = () => {
    if (isTypingRef.current) {
      socket.emit('typing:stop', { conversationId });
      isTypingRef.current = false;
    }
    clearTimeout(typingTimeoutRef.current);
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    if (editingMessage) return; // no typing indicator while editing

    if (!isTypingRef.current) {
      socket.emit('typing:start', { conversationId });
      isTypingRef.current = true;
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, TYPING_STOP_DELAY);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (file.size > MAX_ATTACHMENT_SIZE) {
      setError('File is too large (15MB max)');
      return;
    }
    setError('');
    setIsUploading(true);
    try {
      const attachment = await uploadAttachment(file);
      setPendingAttachment(attachment);
    } catch {
      setError('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();

    if (editingMessage) {
      if (!trimmed) return;
      const response = await editMessage(editingMessage._id, trimmed);
      if (response?.error) {
        setError(response.error);
      } else {
        setContent('');
        onCancelEdit();
      }
      return;
    }

    if (!trimmed && !pendingAttachment) return;

    setContent('');
    const attachmentToSend = pendingAttachment;
    setPendingAttachment(null);
    stopTyping();

    const response = await sendMessage(conversationId, trimmed, {
      replyTo: replyingTo?._id || null,
      attachments: attachmentToSend ? [attachmentToSend] : [],
    });

    if (response?.error) {
      // Put everything back so a failed send doesn't silently lose the draft.
      setContent(trimmed);
      setPendingAttachment(attachmentToSend);
      setError(response.error);
    } else {
      onCancelReply?.();
    }
  };

  return (
    <div className="border-t border-border-subtle">
      {(replyingTo || editingMessage) && (
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs">
          <span className="truncate text-text-secondary">
            {editingMessage ? 'Editing message' : `Replying to: ${replyingTo.content || 'attachment'}`}
          </span>
          <button
            onClick={editingMessage ? onCancelEdit : onCancelReply}
            className="ml-2 shrink-0 text-text-muted hover:text-text-primary"
          >
            Cancel
          </button>
        </div>
      )}

      {pendingAttachment && (
        <div className="flex items-center justify-between border-b border-border-subtle px-3 py-1.5 text-xs">
          <span className="flex items-center gap-1.5 truncate text-text-secondary">
            <Paperclip size={12} />
            {pendingAttachment.fileName}
          </span>
          <button
            onClick={() => setPendingAttachment(null)}
            className="ml-2 shrink-0 text-text-muted hover:text-danger"
          >
            Remove
          </button>
        </div>
      )}

      {error && <p className="px-3 pt-1.5 text-xs text-danger">{error}</p>}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
        {!editingMessage && (
          <>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="shrink-0 rounded-full p-2 text-text-secondary hover:bg-surface-elevated hover:text-text-primary disabled:opacity-40"
              title="Attach a file"
            >
              <Paperclip size={18} />
            </button>
          </>
        )}
        <input
          type="text"
          value={content}
          onChange={handleChange}
          placeholder={isUploading ? 'Uploading…' : 'Message…'}
          className="flex-1 rounded-full border border-border-subtle bg-surface-elevated px-4 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={(!content.trim() && !pendingAttachment) || isUploading}
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover disabled:opacity-40"
        >
          {editingMessage ? 'Save' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
