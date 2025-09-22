import { AppHeader } from '@/components/layout/app-header';
import { HistoryWeekView } from '@/components/history-week-view';
import { getWeekParticipation } from '@/lib/participation';

export default async function HistoryPage() {
  const initialWeekData = await getWeekParticipation(0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title="History" />
      
      <main className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <HistoryWeekView 
            initialWeekData={initialWeekData}
            initialWeekOffset={0}
          />
        </div>
      </main>
    </div>
  );
}