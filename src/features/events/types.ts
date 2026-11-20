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
  startsAt: string;
  endsAt: string;
  venue: string;
  organizer: string;
  imageUrl: string;
  capacity: number;
  registeredCount: number;
  tags: string[];
}
