// Shapes from docs/PROJECT_BRIEF.md. The mock API (S3) returns the same shape.

export type EventCategory =
  | 'workshop'
  | 'talk'
  | 'hackathon'
  | 'career'
  | 'social';

export interface FitEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startsAt: string; // ISO 8601
  endsAt: string; // ISO 8601
  venue: string;
  organizer: string;
  imageUrl: string;
  capacity: number;
  registeredCount: number;
  tags: string[];
}
