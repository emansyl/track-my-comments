"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, ChevronDown, ChevronUp, Calendar, CheckCircle, X } from "lucide-react";
import { CourseStatistics, SessionDetail } from "@/lib/types";
import { getCourseColorClasses } from "@/lib/course-colors";
import { cn } from "@/lib/utils";

interface CourseStatsCardProps {
  course: CourseStatistics;
}

export function CourseStatsCard({ course }: CourseStatsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const courseColors = getCourseColorClasses(course.courseName);

  const getStatusConfig = (sessionsSince: number) => {
    if (sessionsSince === 0) return {
      color: "text-green-600",
      bgColor: "bg-green-100",
      indicator: "🟢"
    };
    if (sessionsSince <= 1) return {
      color: "text-blue-600", 
      bgColor: "bg-blue-100",
      indicator: "🔵"
    };
    if (sessionsSince <= 2) return {
      color: "text-yellow-600",
      bgColor: "bg-yellow-100", 
      indicator: "🟡"
    };
    return {
      color: "text-red-600",
      bgColor: "bg-red-100",
      indicator: "🔴"
    };
  };

  const getStatusText = (sessionsSince: number) => {
    if (sessionsSince === 0) return "Current";
    if (sessionsSince === 1) return "1 session ago";
    return `${sessionsSince} sessions ago`;
  };

  const renderStars = (quality: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < quality ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const statusConfig = getStatusConfig(course.sessionsSinceLastParticipation);

  const formatSessionDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short", 
      day: "numeric",
    });
  };

  const getParticipationIcon = (session: SessionDetail) => {
    if (session.participated) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <X className="h-4 w-4 text-red-500" />;
  };

  const getParticipationText = (session: SessionDetail) => {
    if (session.participated) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-green-700 font-medium">Participated</span>
          {session.quality && (
            <div className="flex items-center gap-1">
              {renderStars(session.quality)}
            </div>
          )}
        </div>
      );
    }
    return <span className="text-red-600">Did not participate</span>;
  };

  return (
    <Card 
      className={cn(
        "border-2 transition-all duration-200 hover:shadow-md",
        courseColors.card,
        courseColors.hover
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={cn("font-semibold text-base mb-2", courseColors.title)}>
              {course.courseName}
            </h3>
            <div className="flex items-center gap-2">
              <div className={cn("rounded-lg p-2 text-xs font-medium flex items-center gap-1", statusConfig.bgColor, statusConfig.color)}>
                <span>{statusConfig.indicator}</span>
                <span>{getStatusText(course.sessionsSinceLastParticipation)}</span>
              </div>
              {course.lastQuality && (
                <div className="flex items-center gap-1">
                  {renderStars(course.lastQuality)}
                </div>
              )}
            </div>
          </div>
          <div className="text-right ml-4">
            <div className={cn("text-lg font-semibold", courseColors.title)}>
              {course.participationPercentage}%
            </div>
            <div className="text-sm text-gray-600">
              {course.participatedSessions}/{course.totalSessionsPassed}
            </div>
          </div>
        </div>
        
        <Progress value={course.participationPercentage} className="h-2 mb-2" />
        
        <div className="flex items-center justify-between">
          {course.lastParticipationDate && (
            <div className="text-xs text-gray-500">
              Last participated: {course.lastParticipationDate.toLocaleDateString()}
            </div>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded hover:bg-opacity-80 transition-colors",
              courseColors.case
            )}
          >
            <span>Sessions ({course.sessions.length})</span>
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {course.sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{formatSessionDate(session.date)}</div>
                      {session.case && (
                        <div className="text-xs text-gray-600">{session.case}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getParticipationIcon(session)}
                    <div className="text-right">
                      {getParticipationText(session)}
                      {session.note && (
                        <div className="text-xs text-gray-500 mt-1 max-w-48 truncate">
                          &ldquo;{session.note}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}