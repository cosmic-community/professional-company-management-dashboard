'use client'

import { useEffect, useState } from 'react'
import { Users, Settings, Star, FileText, TrendingUp, Clock } from 'lucide-react'
import { 
  getServices, 
  getTeamMembers, 
  getTestimonials, 
  getCaseStudies 
} from '@/lib/cosmic'
import type { DashboardStats } from '@/types'
import LoadingSpinner from './LoadingSpinner'

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        
        const [services, teamMembers, testimonials, caseStudies] = await Promise.all([
          getServices(),
          getTeamMembers(),
          getTestimonials(),
          getCaseStudies()
        ])

        // Gather recent activity from all content types
        const allContent = [
          ...services.map(item => ({ ...item, contentType: 'Service' })),
          ...teamMembers.map(item => ({ ...item, contentType: 'Team Member' })),
          ...testimonials.map(item => ({ ...item, contentType: 'Testimonial' })),
          ...caseStudies.map(item => ({ ...item, contentType: 'Case Study' }))
        ]

        const recentActivity = allContent
          .sort((a, b) => new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime())
          .slice(0, 5)
          .map(item => ({
            type: item.contentType,
            title: item.title,
            timestamp: item.modified_at
          }))

        setStats({
          totalServices: services.length,
          totalTeamMembers: teamMembers.length,
          totalTestimonials: testimonials.length,
          totalCaseStudies: caseStudies.length,
          recentActivity
        })
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Error loading dashboard</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Services',
      value: stats.totalServices,
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Team Members',
      value: stats.totalTeamMembers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Testimonials',
      value: stats.totalTestimonials,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'Case Studies',
      value: stats.totalCaseStudies,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {activity.type} • {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No recent activity</p>
          )}
        </div>

        {/* Content Summary */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Content Summary</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Services</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.totalServices}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Team Members</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{stats.totalTeamMembers}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-900">Testimonials</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{stats.totalTestimonials}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Case Studies</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">{stats.totalCaseStudies}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a 
            href="/services"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Settings className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Manage Services</span>
          </a>
          
          <a 
            href="/team"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Users className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Team Members</span>
          </a>
          
          <a 
            href="/testimonials"
            className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Star className="w-8 h-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-yellow-900">Testimonials</span>
          </a>
          
          <a 
            href="/case-studies"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FileText className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Case Studies</span>
          </a>
        </div>
      </div>
    </div>
  )
}