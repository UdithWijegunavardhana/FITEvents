const TIME_ZONE = 'Asia/Colombo';
const LOCALE = 'en-GB';

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: TIME_ZONE,
  });
}

export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIME_ZONE,
  });
}

export function formatTimeRange(startIso: string, endIso: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: TIME_ZONE,
  };
  const start = new Date(startIso).toLocaleTimeString(LOCALE, options);
  const end = new Date(endIso).toLocaleTimeString(LOCALE, options);
  return `${start} – ${end}`;
}
