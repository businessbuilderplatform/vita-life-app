import { Suspense } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { HealthMetrics } from '@/components/dashboard/health-metrics';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Suspense fallback={<LoadingSpinner />}>
              <HealthMetrics />
              <AIInsights />
            </Suspense>
          </div>
          <div className="space-y-8">
            <Suspense fallback={<LoadingSpinner />}>
              <QuickActions />
              <RecentActivity />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}