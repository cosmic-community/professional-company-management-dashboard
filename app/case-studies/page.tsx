import { Suspense } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import CaseStudiesManager from '@/components/CaseStudiesManager'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function CaseStudiesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Case Studies Management</h1>
          <p className="text-gray-600 mt-2">Manage project case studies and success stories</p>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <CaseStudiesManager />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}