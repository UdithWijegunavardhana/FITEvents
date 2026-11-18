// Events happen in Sri Lanka, so always show Sri Lankan time,
// even if the phone (or the emulator) is set to another time zone.
const TIME_ZONE = 'Asia/Colombo';
const LOCALE = 'en-GB';

// "Tue, 25 Nov"
export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: TIME_ZONE,
  });
}

// "Wednesday, 25 November 2026"
export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIME_ZONE,
  });
}

// "2:00 pm – 5:00 pm"
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
