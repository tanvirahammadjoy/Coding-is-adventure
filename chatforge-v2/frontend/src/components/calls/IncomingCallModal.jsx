import { Phone, PhoneOff } from 'lucide-react';
import Avatar from '../common/Avatar';
import useCallStore from '../../store/useCallStore';

function IncomingCallModal() {
  const activeCall = useCallStore((state) => state.activeCall);
  const acceptCall = useCallStore((state) => state.acceptCall);
  const declineCall = useCallStore((state) => state.declineCall);

  if (!activeCall || activeCall.status !== 'ringing-incoming') return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xs animate-modal-in rounded-2xl border border-border-subtle bg-surface p-6 text-center">
        <div className="flex justify-center">
          <Avatar src={activeCall.caller?.avatar} name={activeCall.caller?.username} size={72} />
        </div>
        <p className="mt-3 font-medium text-text-primary">{activeCall.caller?.username}</p>
        <p className="text-sm text-text-muted">
          Incoming {activeCall.callType === 'video' ? 'video' : 'voice'} call
          {activeCall.isGroupCall ? ' (group)' : ''}
        </p>
        <div className="mt-5 flex justify-center gap-4">
          <button
            onClick={declineCall}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-danger text-white"
            title="Decline"
          >
            <PhoneOff size={20} />
          </button>
          <button
            onClick={acceptCall}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-secondary text-bg"
            title="Accept"
          >
            <Phone size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCallModal;
