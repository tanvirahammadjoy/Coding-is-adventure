import { useMemo } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import VideoTile from './VideoTile';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import useCallStore from '../../store/useCallStore';
import { getConversationDisplay } from '../../lib/conversationDisplay';

function ActiveCallView() {
  const activeCall = useCallStore((state) => state.activeCall);
  const remoteStreams = useCallStore((state) => state.remoteStreams);
  const isMuted = useCallStore((state) => state.isMuted);
  const isCameraOff = useCallStore((state) => state.isCameraOff);
  const toggleMute = useCallStore((state) => state.toggleMute);
  const toggleCamera = useCallStore((state) => state.toggleCamera);
  const endCall = useCallStore((state) => state.endCall);
  const getLocalStream = useCallStore((state) => state.getLocalStream);
  const currentUser = useAuthStore((state) => state.user);
  const conversations = useChatStore((state) => state.conversations);

  const conversation = conversations.find((c) => c._id === activeCall?.conversationId);

  const remoteParticipants = useMemo(() => {
    if (!conversation) return [];
    return conversation.participants.filter((p) => p._id !== currentUser?.id);
  }, [conversation, currentUser]);

  if (!activeCall || activeCall.status === 'ringing-incoming') return null;

  const isRingingOutgoing = activeCall.status === 'ringing-outgoing';
  const display = conversation
    ? getConversationDisplay(conversation, currentUser?.id, new Set())
    : { name: activeCall.caller?.username || 'Call' };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-bg">
      <div className="px-5 py-4">
        <p className="font-medium text-text-primary">{display.name}</p>
        <p className="text-xs text-text-muted">
          {isRingingOutgoing
            ? 'Calling…'
            : `${activeCall.callType === 'video' ? 'Video' : 'Voice'} call`}
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center p-4">
        {isRingingOutgoing ? (
          <p className="text-text-muted">Waiting for an answer…</p>
        ) : (
          <div
            className={`grid w-full max-w-3xl gap-3 ${
              remoteParticipants.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {remoteParticipants.map((p) => (
              <VideoTile key={p._id} stream={remoteStreams[p._id]} name={p.username} avatar={p.avatar} />
            ))}
          </div>
        )}

        {activeCall.callType === 'video' && (
          <div className="absolute bottom-4 right-4 h-32 w-24 overflow-hidden rounded-xl border border-border-subtle sm:h-40 sm:w-28">
            <VideoTile
              stream={getLocalStream()}
              name="You"
              avatar={currentUser?.avatar}
              isVideoOff={isCameraOff}
              isMuted
              isLocal
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 pb-8 pt-4">
        <button
          onClick={toggleMute}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isMuted ? 'bg-danger text-white' : 'bg-surface-elevated text-text-primary'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        {activeCall.callType === 'video' && (
          <button
            onClick={toggleCamera}
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isCameraOff ? 'bg-danger text-white' : 'bg-surface-elevated text-text-primary'
            }`}
            title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
          >
            {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
        )}
        <button
          onClick={endCall}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-danger text-white"
          title="End call"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}

export default ActiveCallView;
