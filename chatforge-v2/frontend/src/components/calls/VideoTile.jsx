import { useEffect, useRef } from 'react';
import Avatar from '../common/Avatar';

function VideoTile({ stream, name, avatar, isMuted, isVideoOff, isLocal }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream || null;
  }, [stream]);

  // Reflects *this side's* toggle state accurately. Note: if the remote
  // peer turns their camera off, their track stays technically "enabled"
  // on our end (WebRTC sends black frames rather than signaling
  // off) - so a remote tile may show black instead of falling back to
  // this avatar. Fixing that needs an explicit media-state event over
  // the socket, which this build doesn't add.
  const hasVideo = !isVideoOff && stream?.getVideoTracks().some((t) => t.enabled);

  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-surface-elevated">
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className={`h-full w-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        <Avatar src={avatar} name={name} size={56} />
      )}
      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
        {name}
      </span>
    </div>
  );
}

export default VideoTile;
