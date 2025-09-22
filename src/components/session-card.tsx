"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen } from "lucide-react";
import { SessionWithStatus } from "@/lib/types";
import { ParticipationWidget } from "@/components/participation-widget";
import { getCourseColorClasses } from "@/lib/course-colors";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  session: SessionWithStatus;
}

export function SessionCard({ session }: SessionCardProps) {
  const {
    courseName,
    case: sessionCase,
    startAt,
    status,
    participation,
  } = session;
  const courseColors = getCourseColorClasses(courseName);

  // const formatTime = (date: Date) => {
  //   return date.toLocaleTimeString("en-US", {
  //     hour: "numeric",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };

  return (
    <Card
      className={cn(
        "w-full shadow-sm border-2 transition-all duration-200",
        courseColors.card,
        courseColors.hover,
        courseColors.mobile,
        courseColors.focus
      )}
    >
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className={cn("font-semibold text-lg mb-2", courseColors.title)}>
            {courseName}
          </h3>

          {sessionCase && (
            <div className="mb-3 flex items-center gap-2">
              <BookOpen
                className={cn("h-4 w-4 flex-shrink-0", courseColors.title)}
              />
              <span
                className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full",
                  courseColors.case
                )}
              >
                {sessionCase}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {startAt.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
            </div>
            {/* <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(startAt)} - {formatTime(endAt)}
              </span>
            </div> */}
          </div>
        </div>

        {status === "not-started" && (
          <Badge variant="secondary" className="text-xs">
            Upcoming
          </Badge>
        )}

        {status === "pending" && (
          <ParticipationWidget
            sessionId={session.id}
            participation={participation}
            mode="quick-set"
          />
        )}

        {status === "completed" && (
          <div className="space-y-3">
            <ParticipationWidget
              sessionId={session.id}
              participation={participation}
              mode="display"
            />

            {participation?.note && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                <span className="font-medium">Note:</span> {participation.note}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
