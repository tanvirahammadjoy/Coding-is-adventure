function Avatar({ src, name, size = 40, online }) {
  const initials = name?.slice(0, 2).toUpperCase() || '?';

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-surface-elevated text-sm font-medium text-text-secondary">
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
          {online && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-secondary opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-surface ${
              online ? 'bg-accent-secondary' : 'bg-text-muted'
            }`}
          />
        </span>
      )}
    </div>
  );
}

export default Avatar;
