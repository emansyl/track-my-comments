'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ParticipationWidget } from '@/components/participation-widget';
import { getCourseColorClasses } from '@/lib/course-colors';
import { cn } from '@/lib/utils';
import { BookOpen, Clock, Calendar, Loader2 } from 'lucide-react';

export interface HistorySession {
  id: string;
  courseName: string;
  case?: string | null;
  startAt: Date;
  endAt: Date;
  participation: {
    id: string;
    participated: boolean;
    quality: number;
    note?: string | null;
  } | null;
}

export interface HistoryGroup {
  date: string;
  sessions: HistorySession[];
}

interface InfiniteHistoryViewProps {
  initialGroups: HistoryGroup[];
  hasMore: boolean;
  onLoadMore: (cursor: Date) => Promise<{
    historyGroups: HistoryGroup[];
    hasMore: boolean;
    nextCursor: Date | null;
  }>;
}

export function InfiniteHistoryView({ 
  initialGroups, 
  hasMore: initialHasMore, 
  onLoadMore 
}: InfiniteHistoryViewProps) {
  const [groups, setGroups] = useState<HistoryGroup[]>(initialGroups);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<Date | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Set initial cursor based on last session
  useEffect(() => {
    if (initialGroups.length > 0) {
      const lastGroup = initialGroups[initialGroups.length - 1];
      const lastSession = lastGroup.sessions[lastGroup.sessions.length - 1];
      setNextCursor(lastSession.startAt);
    }
  }, [initialGroups]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !nextCursor) return;

    setIsLoading(true);
    try {
      const result = await onLoadMore(nextCursor);
      setGroups(prev => [...prev, ...result.historyGroups]);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    } catch (error) {
      console.error('Error loading more history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, nextCursor, onLoadMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSessionUpdate = () => {
    // Refresh the current view - could be optimized with better state management
    window.location.reload();
  };

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No session history yet
        </h3>
        <p className="text-gray-600">
          Your participation history will appear here as you attend classes
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group, groupIndex) => (
        <div key={`${group.date}-${groupIndex}`} className="space-y-3">
          {/* Sticky Date Header */}
          <div className="sticky top-0 z-10 bg-gray-50 py-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              {group.date}
            </h2>
          </div>

          {/* Sessions for this date */}
          <div className="space-y-3">
            {group.sessions.map((session) => (
              <HistorySessionItem 
                key={session.id} 
                session={session} 
                onUpdate={handleSessionUpdate}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="py-4">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500 mr-2" />
            <span className="text-gray-500">Loading more sessions...</span>
          </div>
        )}
        {!hasMore && groups.length > 0 && (
          <div className="text-center text-gray-500 py-4">
            <span>You&apos;ve reached the beginning of your history</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual session item component
function HistorySessionItem({ 
  session, 
  onUpdate 
}: { 
  session: HistorySession; 
  onUpdate: () => void; 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const courseColors = getCourseColorClasses(session.courseName);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getParticipationStatus = () => {
    if (!session.participation) return { icon: '—', text: 'No record', color: 'text-gray-400' };
    if (session.participation.participated) {
      return { 
        icon: '✓', 
        text: `Participated`, 
        color: 'text-green-600',
        quality: session.participation.quality
      };
    }
    return { icon: '✗', text: 'Didn\'t participate', color: 'text-gray-500' };
  };

  const status = getParticipationStatus();

  const createMinimalParticipation = (participation: any) => {
    if (!participation) return null;
    
    return {
      id: participation.id,
      userId: '',
      courseSessionId: '',
      participated: participation.participated,
      quality: participation.quality,
      note: participation.note,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  if (isEditing) {
    return (
      <Card className={cn('border-2', courseColors.card)}>
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className={cn('font-semibold text-lg', courseColors.title)}>
              {session.courseName}
            </h3>
            {session.case && (
              <div className="mt-2 mb-3 flex items-center gap-2">
                <BookOpen className={cn('h-4 w-4 flex-shrink-0', courseColors.title)} />
                <span className={cn('text-sm font-medium px-3 py-1 rounded-full', courseColors.case)}>
                  {session.case}
                </span>
              </div>
            )}
            <div className="text-sm text-gray-600">
              {formatTime(session.startAt)} - {formatTime(session.endAt)}
            </div>
          </div>
          
          <ParticipationWidget
            sessionId={session.id}
            participation={createMinimalParticipation(session.participation)}
            mode="edit"
            onUpdate={() => {
              setIsEditing(false);
              onUpdate();
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        'cursor-pointer hover:shadow-md transition-all duration-200 border-2',
        courseColors.card,
        courseColors.hover,
        courseColors.mobile,
        courseColors.focus
      )}
      onClick={() => setIsEditing(true)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={cn('font-medium', courseColors.title)}>
                {session.courseName}
              </h3>
              <span className={cn('text-lg', status.color)}>
                {status.icon}
              </span>
              {status.quality && (
                <div className="flex gap-1">
                  {Array.from({ length: 3 }, (_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'text-xs',
                        i < status.quality! ? 'text-yellow-400' : 'text-gray-300'
                      )}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {session.case && (
              <div className="mb-2 flex items-center gap-2">
                <BookOpen className={cn('h-3 w-3 flex-shrink-0', courseColors.title)} />
                <span className={cn('text-xs font-medium px-2 py-1 rounded-full', courseColors.case)}>
                  {session.case}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {formatTime(session.startAt)} - {formatTime(session.endAt)}
              </div>
              <span className="text-xs text-blue-600">Tap to edit</span>
            </div>
          </div>
        </div>

        {session.participation?.note && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-gray-700">
            <span className="font-medium">Note:</span> {session.participation.note}
          </div>
        )}
      </CardContent>
    </Card>
  );
}