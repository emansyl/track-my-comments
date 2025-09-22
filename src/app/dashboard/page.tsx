import { AppHeader } from "@/components/layout/app-header";
import { SessionCard } from "@/components/session-card";
import { getTodaysParticipation } from "@/lib/participation";
import { SessionWithStatus, SessionWithCourse } from "@/lib/types";

function getSessionStatus(
  session: SessionWithCourse
): SessionWithStatus["status"] {
  const now = new Date();
  const sessionStart = new Date(session.startAt);

  if (now < sessionStart) {
    return "not-started";
  } else if (session.participation) {
    return "completed";
  } else {
    return "pending";
  }
}

export default async function DashboardPage() {
  const sessionsData = await getTodaysParticipation();

  const sessionsWithStatus: SessionWithStatus[] = sessionsData.map(
    (session) => ({
      ...session,
      status: getSessionStatus(session),
    })
  );

  const today = new Date();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title="Schedule" subtitle={formatDate(today)} />

      <main className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {sessionsWithStatus.length > 0 ? (
            sessionsWithStatus.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No classes scheduled for today!
              </h3>
              <p className="text-gray-600">Enjoy your free time</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
