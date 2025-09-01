import { Suspense } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import TestimonialsManager from '@/components/TestimonialsManager'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function TestimonialsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600 mt-2">Manage client testimonials and reviews</p>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <TestimonialsManager />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}