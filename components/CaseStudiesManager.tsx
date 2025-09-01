'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, FileText, ExternalLink, Calendar, Users } from 'lucide-react'
import { getCaseStudies, deleteCaseStudy } from '@/lib/cosmic'
import type { CaseStudy } from '@/types'
import LoadingSpinner from './LoadingSpinner'

export default function CaseStudiesManager() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCaseStudies()
  }, [])

  async function fetchCaseStudies() {
    try {
      setLoading(true)
      const data = await getCaseStudies()
      setCaseStudies(data)
    } catch (err) {
      setError('Failed to load case studies')
      console.error('Case studies error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(caseStudy: CaseStudy) {
    if (!confirm(`Are you sure you want to delete "${caseStudy.title}"?`)) {
      return
    }

    try {
      await deleteCaseStudy(caseStudy.id)
      setCaseStudies(caseStudies.filter(cs => cs.id !== caseStudy.id))
    } catch (error) {
      alert('Failed to delete case study')
      console.error('Delete error:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Error loading case studies</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchCaseStudies}
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
          <h2 className="text-2xl font-bold text-gray-900">Case Studies</h2>
          <p className="text-gray-600">{caseStudies.length} case studies total</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Case Study
        </button>
      </div>

      {/* Case Studies Grid */}
      {caseStudies.length > 0 ? (
        <div className="content-grid">
          {caseStudies.map((caseStudy) => (
            <div key={caseStudy.id} className="card hover:shadow-md transition-shadow">
              {/* Featured Image */}
              {caseStudy.metadata?.featured_image && (
                <div className="mb-4 -mx-6 -mt-6">
                  <img
                    src={`${caseStudy.metadata.featured_image.imgix_url}?w=600&h=200&fit=crop&auto=format,compress`}
                    alt={caseStudy.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                </div>
              )}

              <div className="space-y-4">
                {/* Project Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {caseStudy.metadata?.project_title || caseStudy.title}
                  </h3>
                  
                  {caseStudy.metadata?.client_name && (
                    <p className="text-primary-600 font-medium text-sm">
                      Client: {caseStudy.metadata.client_name}
                    </p>
                  )}
                </div>

                {/* Project Overview */}
                {caseStudy.metadata?.project_overview && (
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {caseStudy.metadata.project_overview}
                  </p>
                )}

                {/* Project Details */}
                <div className="space-y-2 text-sm">
                  {caseStudy.metadata?.project_duration && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Duration: {caseStudy.metadata.project_duration}</span>
                    </div>
                  )}

                  {caseStudy.metadata?.team_members && caseStudy.metadata.team_members.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Team: {caseStudy.metadata.team_members.length} members</span>
                    </div>
                  )}

                  {caseStudy.metadata?.website_url && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <ExternalLink className="w-4 h-4" />
                      <a
                        href={caseStudy.metadata.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 truncate"
                      >
                        View Live Site
                      </a>
                    </div>
                  )}
                </div>

                {/* Services Used */}
                {caseStudy.metadata?.services_used && caseStudy.metadata.services_used.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Services Used:</p>
                    <div className="flex flex-wrap gap-1">
                      {caseStudy.metadata.services_used.slice(0, 3).map((service, index) => (
                        <span
                          key={service.id || index}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                        >
                          {service.metadata?.service_name || service.title}
                        </span>
                      ))}
                      {caseStudy.metadata.services_used.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          +{caseStudy.metadata.services_used.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(caseStudy)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No case studies yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first case study</p>
          <button className="btn-primary">
            Add Case Study
          </button>
        </div>
      )}
    </div>
  )
}