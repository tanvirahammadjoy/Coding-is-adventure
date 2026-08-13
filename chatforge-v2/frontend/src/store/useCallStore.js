import { create } from 'zustand';
import { socket } from '../lib/socket';

// Google's public STUN server - free, handles NAT traversal for most
// home/office networks. It does NOT relay media, so it won't help on a
// network with a symmetric NAT or a restrictive firewall - that needs a
// TURN server (self-hosted via coturn, or a paid service like Twilio/
// Xirsys), which isn't wired up here. Add it to this array if needed:
// { urls: 'turn:your-turn-host', username: '...', credential: '...' }
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// Peer connections and the local media stream are mutable, non-serializable
// browser objects that don't belong in reactive state directly - kept as
// plain module state, with only their *effects* (remote streams, connection
// status) mirrored into the store for components to render from.
let peerConnections = new Map(); // userId -> RTCPeerConnection
let localStream = null;

const createPeerConnection = (peerId, get, set) => {
  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  localStream?.getTracks().forEach((track) => pc.addTrack(track, localStream));

  pc.ontrack = (event) => {
    set((state) => ({ remoteStreams: { ...state.remoteStreams, [peerId]: event.streams[0] } }));
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('call:ice-candidate', {
        callId: get().activeCall?.callId,
        to: peerId,
        candidate: event.candidate,
      });
    }
  };

  pc.onconnectionstatechange = () => {
    set((state) => ({
      peerConnectionStates: { ...state.peerConnectionStates, [peerId]: pc.connectionState },
    }));
  };

  peerConnections.set(peerId, pc);
  return pc;
};

const closePeerConnection = (peerId, set) => {
  peerConnections.get(peerId)?.close();
  peerConnections.delete(peerId);
  set((state) => {
    const remoteStreams = { ...state.remoteStreams };
    const peerConnectionStates = { ...state.peerConnectionStates };
    delete remoteStreams[peerId];
    delete peerConnectionStates[peerId];
    return { remoteStreams, peerConnectionStates };
  });
};

const cleanupCall = (set) => {
  peerConnections.forEach((pc) => pc.close());
  peerConnections = new Map();
  localStream?.getTracks().forEach((track) => track.stop());
  localStream = null;
  set({
    activeCall: null,
    remoteStreams: {},
    peerConnectionStates: {},
    localStreamActive: false,
    isMuted: false,
    isCameraOff: false,
  });
};

const useCallStore = create((set, get) => ({
  // { callId, conversationId, callType, isGroupCall, status, caller? }
  // status: 'ringing-outgoing' | 'ringing-incoming' | 'active'
  activeCall: null,
  remoteStreams: {}, // { [userId]: MediaStream }
  peerConnectionStates: {}, // { [userId]: RTCPeerConnection.connectionState }
  localStreamActive: false,
  isMuted: false,
  isCameraOff: false,
  callError: null,

  getLocalStream: () => localStream,

  startCall: async (conversationId, callType, isGroupCall) => {
    if (get().activeCall) return; // already on a call - one at a time

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video',
      });
      set({ localStreamActive: true });
    } catch {
      set({ callError: 'Could not access camera/microphone' });
      return;
    }

    socket.emit('call:invite', { conversationId, callType }, (response) => {
      if (response?.error) {
        set({ callError: response.error });
        localStream?.getTracks().forEach((t) => t.stop());
        localStream = null;
        set({ localStreamActive: false });
        return;
      }
      set({
        activeCall: {
          callId: response.callId,
          conversationId,
          callType,
          isGroupCall,
          status: 'ringing-outgoing',
        },
      });
    });
  },

  acceptCall: async () => {
    const call = get().activeCall;
    if (!call) return;

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: call.callType === 'video',
      });
      set({ localStreamActive: true });
    } catch {
      set({ callError: 'Could not access camera/microphone' });
      socket.emit('call:decline', { callId: call.callId });
      cleanupCall(set);
      return;
    }

    socket.emit('call:accept', { callId: call.callId }, (response) => {
      if (response?.error) {
        set({ callError: response.error });
        cleanupCall(set);
        return;
      }
      set({ activeCall: { ...get().activeCall, status: 'active' } });
    });
  },

  declineCall: () => {
    const call = get().activeCall;
    if (!call) return;
    socket.emit('call:decline', { callId: call.callId });
    cleanupCall(set);
  },

  endCall: () => {
    const call = get().activeCall;
    if (call) socket.emit('call:end', { callId: call.callId });
    cleanupCall(set);
  },

  toggleMute: () => {
    if (!localStream) return;
    const nextMuted = !get().isMuted;
    localStream.getAudioTracks().forEach((t) => (t.enabled = !nextMuted));
    set({ isMuted: nextMuted });
  },

  toggleCamera: () => {
    if (!localStream) return;
    const nextOff = !get().isCameraOff;
    localStream.getVideoTracks().forEach((t) => (t.enabled = !nextOff));
    set({ isCameraOff: nextOff });
  },

  initCallSocketListeners: () => {
    socket.on('call:incoming', (payload) => {
      // Only one call at a time in this build - a second incoming call
      // while already on one gets auto-declined rather than queued.
      if (get().activeCall) {
        socket.emit('call:decline', { callId: payload.callId });
        return;
      }
      set({
        activeCall: {
          callId: payload.callId,
          conversationId: payload.conversationId,
          callType: payload.callType,
          isGroupCall: payload.isGroupCall,
          status: 'ringing-incoming',
          caller: payload.caller,
        },
      });
    });

    // I just joined an in-progress call - offer to each peer already on
    // it. They didn't offer to me first; the joiner always initiates,
    // which sidesteps two sides racing to offer at the same time.
    socket.on('call:existing-peers', async ({ peerIds }) => {
      for (const peerId of peerIds) {
        const pc = createPeerConnection(peerId, get, set);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('call:offer', { callId: get().activeCall?.callId, to: peerId, sdp: offer });
      }
      set((state) => ({ activeCall: state.activeCall && { ...state.activeCall, status: 'active' } }));
    });

    // Someone else joined the call I'm already on - nothing to send yet,
    // their offer arrives via call:offer and we answer it there.
    socket.on('call:peer-joined', () => {
      set((state) => ({ activeCall: state.activeCall && { ...state.activeCall, status: 'active' } }));
    });

    socket.on('call:offer', async ({ from, sdp }) => {
      const pc = createPeerConnection(from, get, set);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('call:answer', { callId: get().activeCall?.callId, to: from, sdp: answer });
    });

    socket.on('call:answer', async ({ from, sdp }) => {
      const pc = peerConnections.get(from);
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on('call:ice-candidate', async ({ from, candidate }) => {
      const pc = peerConnections.get(from);
      if (!pc) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {
        // Benign - a candidate that arrives before the remote description
        // is set gets dropped; WebRTC keeps discovering more regardless.
      }
    });

    // My own other tab answered this call - stop ringing here.
    socket.on('call:answered-elsewhere', ({ callId }) => {
      const call = get().activeCall;
      if (call?.callId === callId && call.status === 'ringing-incoming') {
        cleanupCall(set);
      }
    });

    socket.on('call:declined', ({ callId }) => {
      const call = get().activeCall;
      if (call?.callId !== callId) return;
      // Direct calls end on the one decline. Group calls the backend
      // only ends this way if nobody ever connected - if we're already
      // active, this is informational and doesn't tear down our call.
      if (!call.isGroupCall) {
        set({ callError: 'Call declined' });
        cleanupCall(set);
      }
    });

    socket.on('call:peer-left', ({ peerId }) => {
      closePeerConnection(peerId, set);
    });

    socket.on('call:ended', ({ callId }) => {
      if (get().activeCall?.callId === callId) cleanupCall(set);
    });
  },

  teardownCallSocketListeners: () => {
    socket.off('call:incoming');
    socket.off('call:existing-peers');
    socket.off('call:peer-joined');
    socket.off('call:offer');
    socket.off('call:answer');
    socket.off('call:ice-candidate');
    socket.off('call:answered-elsewhere');
    socket.off('call:declined');
    socket.off('call:peer-left');
    socket.off('call:ended');
  },
}));

export default useCallStore;
