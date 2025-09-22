'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getCourseColorClasses } from '@/lib/course-colors';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export interface CourseTracking {
  courseName: string;
  sessionsSinceLastParticipation: number;
  lastParticipationDate?: Date | null;
  lastQuality?: number | null;
  status: 'excellent' | 'good' | 'attention' | 'critical';
}

interface CourseTrackingCardProps {
  courseTracking: CourseTracking;
}

export function CourseTrackingCard({ courseTracking }: CourseTrackingCardProps) {
  const { courseName, sessionsSinceLastParticipation, lastParticipationDate, lastQuality, status } = courseTracking;
  const courseColors = getCourseColorClasses(courseName);

  const getStatusConfig = () => {
    switch (status) {
      case 'excellent':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          message: 'Excellent participation!',
          indicator: '🟢'
        };
      case 'good':
        return {
          icon: TrendingUp,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          message: 'Good participation',
          indicator: '🔵'
        };
      case 'attention':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          message: 'Needs attention',
          indicator: '🟡'
        };
      case 'critical':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          message: 'Needs participation',
          indicator: '🔴'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const formatLastParticipation = () => {
    if (!lastParticipationDate) return 'Never participated';
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastParticipationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getQualityStars = (quality: number) => {
    const labels = { 1: 'Basic', 2: 'Good', 3: 'Great' };
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-600">{labels[quality as keyof typeof labels]}</span>
        <div className="flex">
          {Array.from({ length: 3 }, (_, i) => (
            <span
              key={i}
              className={cn(
                'text-xs',
                i < quality ? 'text-yellow-400' : 'text-gray-300'
              )}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn(
      'min-w-[280px] max-w-[300px] border-2 transition-all duration-200 hover:shadow-md',
      courseColors.card,
      courseColors.hover
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={cn('font-semibold text-base leading-tight', courseColors.title)}>
              {courseName}
            </h3>
          </div>
          <span className="text-lg ml-2">{statusConfig.indicator}</span>
        </div>

        <div className={cn('rounded-lg p-3 mb-3', statusConfig.bgColor)}>
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className={cn('h-4 w-4', statusConfig.color)} />
            <span className={cn('text-sm font-medium', statusConfig.color)}>
              {statusConfig.message}
            </span>
          </div>
          
          <div className="text-sm text-gray-700">
            {sessionsSinceLastParticipation === 0 ? (
              'Participated in last session'
            ) : sessionsSinceLastParticipation === 1 ? (
              '1 session since last participation'
            ) : (
              `${sessionsSinceLastParticipation} sessions since last participation`
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Last participation:</span>
            <span className="font-medium">{formatLastParticipation()}</span>
          </div>
          
          {lastQuality && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quality:</span>
              {getQualityStars(lastQuality)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}