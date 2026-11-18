# FIT Events — Project Brief

## What it is
A mobile app where Faculty of IT students discover faculty events (workshops, tech talks, hackathons, career fairs, socials), bookmark them, register, and check in at the venue by scanning a QR code.

## Who uses it
- **Students** (primary): browse, search, bookmark, register, check in, get reminders.
- **Organisers** are out of scope for the app — events are managed in the mock backend.

## Screens
| Screen | Purpose |
|---|---|
| Home | Upcoming events list, category filter chips, search, pull-to-refresh |
| Event Detail | Image, title, date/time, venue, organiser, description, capacity, Bookmark + Register buttons |
| Bookmarks | Saved events; works offline |
| Profile | Signed-in user, my registrations, settings, logout |
| Sign In | Email + password |
| Check-in | Camera QR scanner → confirms attendance for a registered event |

Navigation: bottom tabs **Home · Bookmarks · Profile**. Home tab is a stack (Home → Event Detail → Check-in). Sign In is shown when logged out for actions that need auth (register, check-in, profile).

## Data model
```ts
type EventCategory = 'workshop' | 'talk' | 'hackathon' | 'career' | 'social';

interface FitEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startsAt: string;      // ISO 8601
  endsAt: string;        // ISO 8601
  venue: string;
  organizer: string;
  imageUrl: string;
  capacity: number;
  registeredCount: number;
  tags: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: 'registered' | 'checked_in' | 'cancelled';
  checkedInAt?: string;
}
```
QR code payload for check-in: `fitevents://checkin?eventId=<id>&code=<eventCheckInCode>`.

## Design
- Clean, neutral UI; one accent colour. Light and dark mode via `src/theme`.
- Event card: image (16:9), category tag, title (max 2 lines), date · venue, bookmark icon.
- Respect safe areas, dynamic type sizes, and minimum 44pt touch targets.

## Non-goals
Payments, organiser admin, chat, maps, social login (can be a stretch goal).
