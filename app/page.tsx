import { Suspense } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardOverview from '@/components/DashboardOverview'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Manage your company content and track performance</p>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardOverview />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}