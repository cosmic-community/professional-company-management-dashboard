import { Suspense } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import TeamManager from '@/components/TeamManager'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function TeamPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage team member profiles and information</p>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <TeamManager />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}