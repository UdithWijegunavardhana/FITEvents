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
