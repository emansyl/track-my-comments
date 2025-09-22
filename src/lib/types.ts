export interface SessionWithCourse {
  id: string;
  courseName: string;
  case?: string | null;
  startAt: Date;
  endAt: Date;
  participation: ParticipationEntry | null;
}

export interface ParticipationEntry {
  id: string;
  userId: string;
  courseSessionId: string;
  participated: boolean;
  quality: number;
  note?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ParticipationStatus = 'not-started' | 'pending' | 'completed';

export interface SessionWithStatus extends SessionWithCourse {
  status: ParticipationStatus;
}