"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWeekData } from "@/app/actions/history";
import { ParticipationWidget } from "@/components/participation-widget";
import { CourseName, getCourseColorClasses } from "@/lib/course-colors";

interface WeekData {
  weekStart: Date;
  weekEnd: Date;
  sessions: Array<{
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
  }>;
}

interface HistoryWeekViewProps {
  initialWeekData: WeekData;
  initialWeekOffset: number;
}

interface HistorySessionCardProps {
  session: {
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
  };
  onUpdate: () => void;
}

// Create a minimal participation entry that satisfies the ParticipationWidget requirements
function createMinimalParticipation(
  participation: {
    id: string;
    participated: boolean;
    quality: number;
    note?: string | null;
  } | null
) {
  if (!participation) return null;

  return {
    id: participation.id,
    userId: "", // Not needed for the form
    courseSessionId: "", // Not needed for the form
    participated: participation.participated,
    quality: participation.quality,
    note: participation.note,
    createdAt: new Date(), // Not needed for the form
    updatedAt: new Date(), // Not needed for the form
  };
}

function HistorySessionCard({ session, onUpdate }: HistorySessionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const courseColors = getCourseColorClasses(session.courseName as CourseName);

  const renderStars = (quality: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < quality ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  // const formatTime = (date: Date) => {
  //   return date.toLocaleTimeString("en-US", {
  //     hour: "numeric",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };

  if (isEditing) {
    return (
      <Card className={cn("border-2", courseColors.card)}>
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className={cn("font-semibold text-lg", courseColors.title)}>
              {session.courseName}
            </h3>
            {session.case && (
              <div className="mt-2 mb-3 flex items-center gap-2">
                <BookOpen
                  className={cn("h-4 w-4 flex-shrink-0", courseColors.title)}
                />
                <span
                  className={cn(
                    "text-sm font-medium px-3 py-1 rounded-full",
                    courseColors.case
                  )}
                >
                  {session.case}
                </span>
              </div>
            )}
            {/* <div className="text-sm text-gray-600">
              {new Date(session.startAt).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}{" "}
              • {formatTime(session.startAt)} - {formatTime(session.endAt)}
            </div> */}
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
        "cursor-pointer hover:shadow-md transition-all duration-200 border-2",
        courseColors.card,
        courseColors.hover,
        courseColors.mobile,
        courseColors.focus
      )}
      onClick={() => setIsEditing(true)}
    >
      <CardContent className="p-4">
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={cn("font-medium", courseColors.title)}>
                  {session.courseName}
                </span>
                {session.participation ? (
                  session.participation.participated ? (
                    <span className="text-green-600 text-lg">✓</span>
                  ) : (
                    <span
                      className={
                        session.participation.quality === 0
                          ? "text-gray-300 text-lg"
                          : "text-gray-400 text-lg"
                      }
                    >
                      {session.participation.quality === 0 ? "—" : "✗"}
                    </span>
                  )
                ) : (
                  <span className="text-gray-300 text-lg">—</span>
                )}
              </div>
              {session.participation?.participated && (
                <div className="flex gap-1">
                  {renderStars(session.participation.quality)}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(session.startAt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          {session.case && (
            <div className="mt-2 flex items-center gap-2">
              <BookOpen
                className={cn("h-3 w-3 flex-shrink-0", courseColors.title)}
              />
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  courseColors.case
                )}
              >
                {session.case}
              </span>
            </div>
          )}
        </div>

        {session.participation?.note && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-gray-700">
            <span className="font-medium">Note:</span>{" "}
            {session.participation.note}
          </div>
        )}

        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {/* <div className="text-xs text-gray-500">
              {formatTime(session.startAt)} - {formatTime(session.endAt)}
            </div> */}
            <div className="text-xs text-blue-600 font-medium">
              Tap to edit →
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function HistoryWeekView({
  initialWeekData,
  initialWeekOffset,
}: HistoryWeekViewProps) {
  const [weekData, setWeekData] = useState<WeekData>(initialWeekData);
  const [weekOffset, setWeekOffset] = useState(initialWeekOffset);
  const [isPending, startTransition] = useTransition();

  const loadWeek = (offset: number) => {
    startTransition(async () => {
      try {
        const result = await getWeekData(offset);
        if (result.success && result.data) {
          setWeekData(result.data);
          setWeekOffset(offset);
        }
      } catch (error) {
        console.error("Error loading week data:", error);
      }
    });
  };

  const formatWeekRange = (start: Date, end: Date) => {
    const startStr = new Date(start).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = new Date(end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  const getWeekStats = () => {
    const totalSessions = weekData.sessions.length;
    const participatedSessions = weekData.sessions.filter(
      (s) => s.participation?.participated
    ).length;
    const participationRate =
      totalSessions > 0
        ? Math.round((participatedSessions / totalSessions) * 100)
        : 0;

    return { totalSessions, participatedSessions, participationRate };
  };

  const { totalSessions, participatedSessions, participationRate } =
    getWeekStats();

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadWeek(weekOffset - 1)}
          disabled={isPending}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-center">
          <h2 className="font-semibold text-gray-900">
            Week of {formatWeekRange(weekData.weekStart, weekData.weekEnd)}
          </h2>
          {weekOffset === 0 && (
            <span className="text-xs text-blue-600 font-medium">This Week</span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadWeek(weekOffset + 1)}
          disabled={weekOffset >= 0 || isPending}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week Stats */}
      {totalSessions > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {participationRate}%
                </div>
                <div className="text-xs text-gray-600">Participation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {participatedSessions}
                </div>
                <div className="text-xs text-gray-600">Participated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {totalSessions}
                </div>
                <div className="text-xs text-gray-600">Total Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {weekData.sessions.length > 0 ? (
          weekData.sessions.map((session) => (
            <HistorySessionCard
              key={session.id}
              session={session}
              onUpdate={() => loadWeek(weekOffset)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sessions this week
            </h3>
            <p className="text-gray-600">
              {weekOffset === 0
                ? "Enjoy your free time!"
                : "Check other weeks for activity"}
            </p>
          </div>
        )}
      </div>

      {isPending && (
        <div className="text-center py-4">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      )}
    </div>
  );
}
