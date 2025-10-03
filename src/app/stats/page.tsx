import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { Star, TrendingUp, Award, BookOpen } from "lucide-react";

import { getUserStatistics } from "@/lib/participation";
import { CourseStatsCard } from "@/components/course-stats-card";





function renderStars(quality: number) {
  return Array.from({ length: 3 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < quality ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
      }`}
    />
  ));
}

export default async function StatsPage() {
  const { overallStatistics, courseStatistics } = await getUserStatistics();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title="Statistics" subtitle="Your participation overview" />

      <main className="px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Overall Statistics Card */}
          <Card className="border-2 shadow-sm bg-indigo-50 border-indigo-200 hover:bg-indigo-100 transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-indigo-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overall Participation
              </CardTitle>
              <CardDescription>Your total participation across all courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main metric */}
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-900 mb-2">
                  {overallStatistics.overallParticipationPercentage}%
                </div>
                <div className="text-gray-600 mb-4">
                  {overallStatistics.totalParticipatedSessions} of {overallStatistics.totalSessionsPassed} sessions
                </div>
                <Progress value={overallStatistics.overallParticipationPercentage} className="h-3" />
              </div>

              {/* Secondary metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    <div className="text-2xl font-semibold text-indigo-900">
                      {overallStatistics.totalCourses}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-indigo-600" />
                    <div className="flex items-center gap-1">
                      {overallStatistics.averageQuality ? renderStars(Math.round(overallStatistics.averageQuality)) : 
                        <span className="text-gray-400 text-sm">No ratings</span>
                      }
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Avg. Quality</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Per-Course Statistics */}
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Breakdown
              </CardTitle>
              <CardDescription>Detailed statistics for each course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseStatistics.length > 0 ? (
                courseStatistics.map((course) => (
                  <CourseStatsCard
                    key={course.courseId}
                    course={course}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No course data available
                  </h3>
                  <p className="text-gray-600">Start participating in classes to see your statistics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}