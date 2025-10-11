export type EventCategory = 
  | 'workshop'
  | 'hackathon'
  | 'seminar'
  | 'competition'
  | 'webinar'
  | 'bootcamp'
  | 'conference'
  | 'networking'
  | 'tech-talk'
  | 'panel-discussion'
  | 'project-showcase'
  | 'coding-contest'
  | 'study-group'
  | 'other';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type RegistrationStatus = 'open' | 'closed' | 'upcoming';

export interface EventHighlight {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  maxParticipants?: number;
  registrationStatus: RegistrationStatus;
  category: EventCategory;
  organizer: string;
  imageUrl: string; // Now required with default placeholder
  tags: string[];
  requirements?: string[];
  createdAt: string;
  updatedAt: string;
  teamEvent?: boolean;
  maxTeamSize?: number;
  minTeamSize?: number;
  // New fields
  eventStatus?: EventStatus;
  eventHighlights?: EventHighlight[];
  eventPhotos?: string[];
  attendanceCount?: number;
  isFeatured?: boolean;
  externalLink?: string;
}

export interface Participant {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  college: string;
  year: string;
  branch: string;
  skills?: string[];
  experience?: string;
  motivation?: string;
  registeredAt: string;
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled';
  teamName?: string;
  teamMembers?: string[];
  isTeamLeader?: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  category: EventCategory;
  tags: string[];
  requirements: string[];
  imageUrl?: string;
  teamEvent?: boolean;
  maxTeamSize?: number;
  minTeamSize?: number;
  eventStatus?: EventStatus;
  isFeatured?: boolean;
  externalLink?: string;
}

export interface ParticipantStats {
  total: number;
  confirmed: number;
  attended: number;
  cancelled: number;
}

export interface EventWithStats extends Event {
  participantCount: number;
  stats: ParticipantStats;
  viewCount?: number;
}

// Event analytics types
export interface EventAnalytics {
  id: string;
  title: string;
  date: string;
  category: EventCategory;
  eventStatus: EventStatus;
  maxParticipants: number;
  participantCount: number;
  attendanceCount: number;
  viewCount: number;
  registrationPercentage: number;
  attendancePercentage: number;
}