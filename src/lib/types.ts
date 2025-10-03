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

export interface SessionDetail {
  id: string;
  date: Date;
  case?: string | null;
  participated: boolean;
  quality: number | null;
  note?: string | null;
}

export interface CourseStatistics {
  courseName: string;
  courseId: string;
  sessionsSinceLastParticipation: number;
  totalSessionsPassed: number;
  participatedSessions: number;
  participationPercentage: number;
  lastParticipationDate: Date | null;
  lastQuality: number | null;
  sessions: SessionDetail[];
}

export interface OverallStatistics {
  totalSessionsPassed: number;
  totalParticipatedSessions: number;
  overallParticipationPercentage: number;
  totalCourses: number;
  averageQuality: number | null;
}

export interface UserStatsData {
  courseStatistics: CourseStatistics[];
  overallStatistics: OverallStatistics;
}