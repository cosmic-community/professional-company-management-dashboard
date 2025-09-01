'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Star, Users } from 'lucide-react'
import { getTestimonials, deleteTestimonial } from '@/lib/cosmic'
import type { Testimonial } from '@/types'
import LoadingSpinner from './LoadingSpinner'

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    try {
      setLoading(true)
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (err) {
      setError('Failed to load testimonials')
      console.error('Testimonials error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(testimonial: Testimonial) {
    if (!confirm(`Are you sure you want to delete the testimonial from "${testimonial.metadata?.client_name}"?`)) {
      return
    }

    try {
      await deleteTestimonial(testimonial.id)
      setTestimonials(testimonials.filter(t => t.id !== testimonial.id))
    } catch (error) {
      alert('Failed to delete testimonial')
      console.error('Delete error:', error)
    }
  }

  function renderStars(rating?: { key: string; value: string }) {
    const starCount = rating ? parseInt(rating.key) : 5
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < starCount
      return (
        <Star
          key={index}
          className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      )
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Error loading testimonials</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchTestimonials}
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          <p className="text-gray-600">{testimonials.length} testimonials total</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      {testimonials.length > 0 ? (
        <div className="content-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card hover:shadow-md transition-shadow">
              {/* Client Info */}
              <div className="flex items-start gap-4 mb-4">
                {testimonial.metadata?.client_photo ? (
                  <img
                    src={`${testimonial.metadata.client_photo.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
                    alt={testimonial.metadata?.client_name || 'Client'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(testimonial.metadata?.rating)}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900">
                    {testimonial.metadata?.client_name || 'Anonymous'}
                  </h3>
                  
                  {testimonial.metadata?.client_title && testimonial.metadata?.company_name && (
                    <p className="text-sm text-gray-600">
                      {testimonial.metadata.client_title} at {testimonial.metadata.company_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Testimonial Text */}
              {testimonial.metadata?.testimonial_text && (
                <blockquote className="text-gray-700 mb-4 italic line-clamp-4">
                  "{testimonial.metadata.testimonial_text}"
                </blockquote>
              )}

              {/* Related Service */}
              {testimonial.metadata?.related_service && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                    {testimonial.metadata.related_service.metadata?.service_name || testimonial.metadata.related_service.title}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first client testimonial</p>
          <button className="btn-primary">
            Add Testimonial
          </button>
        </div>
      )}
    </div>
  )
}