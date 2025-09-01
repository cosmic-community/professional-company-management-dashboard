import { Suspense } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import ServicesManager from '@/components/ServicesManager'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 mt-2">Manage your service offerings and pricing</p>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <ServicesManager />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}