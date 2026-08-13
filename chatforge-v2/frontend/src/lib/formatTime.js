import { formatDistanceToNowStrict, isToday, isYesterday, format } from 'date-fns';

// Message bubble timestamp: time-of-day if it's today, otherwise a date.
export const formatMessageTimestamp = (date) => {
  const d = new Date(date);
  if (isToday(d)) return format(d, 'h:mm a');
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
};

// Conversation list preview timestamp: compact relative time ("2m", "3h").
export const formatRelativeShort = (date) =>
  formatDistanceToNowStrict(new Date(date), { addSuffix: false })
    .replace(' seconds', 's')
    .replace(' second', 's')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' months', 'mo')
    .replace(' month', 'mo')
    .replace(' years', 'y')
    .replace(' year', 'y');

// Call log duration: seconds -> "M:SS"
export const formatCallDuration = (totalSeconds = 0) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};
