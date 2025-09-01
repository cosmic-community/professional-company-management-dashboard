'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Users, Mail, Linkedin } from 'lucide-react'
import { getTeamMembers, deleteTeamMember } from '@/lib/cosmic'
import type { TeamMember } from '@/types'
import LoadingSpinner from './LoadingSpinner'
import TeamMemberModal from './TeamMemberModal'

export default function TeamManager() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  async function fetchTeamMembers() {
    try {
      setLoading(true)
      const data = await getTeamMembers()
      setTeamMembers(data)
    } catch (err) {
      setError('Failed to load team members')
      console.error('Team members error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(member: TeamMember) {
    if (!confirm(`Are you sure you want to delete "${member.title}"?`)) {
      return
    }

    try {
      await deleteTeamMember(member.id)
      setTeamMembers(teamMembers.filter(m => m.id !== member.id))
    } catch (error) {
      alert('Failed to delete team member')
      console.error('Delete error:', error)
    }
  }

  function handleCreate() {
    setSelectedMember(null)
    setModalMode('create')
    setShowModal(true)
  }

  function handleEdit(member: TeamMember) {
    setSelectedMember(member)
    setModalMode('edit')
    setShowModal(true)
  }

  function handleModalSuccess(member: TeamMember) {
    if (modalMode === 'create') {
      setTeamMembers([member, ...teamMembers])
    } else {
      setTeamMembers(teamMembers.map(m => m.id === member.id ? member : m))
    }
    setShowModal(false)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Error loading team members</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchTeamMembers}
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
          <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          <p className="text-gray-600">{teamMembers.length} team members total</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Team Member
        </button>
      </div>

      {/* Team Members Grid */}
      {teamMembers.length > 0 ? (
        <div className="content-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="card hover:shadow-md transition-shadow">
              {/* Profile Photo */}
              <div className="flex items-start gap-4 mb-4">
                {member.metadata?.profile_photo ? (
                  <img
                    src={`${member.metadata.profile_photo.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
                    alt={member.title}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.metadata?.full_name || member.title}
                  </h3>
                  
                  {member.metadata?.job_title && (
                    <p className="text-primary-600 font-medium text-sm mb-2">
                      {member.metadata.job_title}
                    </p>
                  )}

                  {member.metadata?.years_experience && (
                    <p className="text-gray-600 text-sm">
                      {member.metadata.years_experience} years experience
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              {member.metadata?.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {member.metadata.bio}
                </p>
              )}

              {/* Contact Info */}
              <div className="flex items-center gap-3 mb-4 text-sm">
                {member.metadata?.email && (
                  <a
                    href={`mailto:${member.metadata.email}`}
                    className="flex items-center gap-1 text-gray-600 hover:text-primary-600"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.metadata.email}</span>
                  </a>
                )}
                
                {member.metadata?.linkedin_url && (
                  <a
                    href={member.metadata.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member)}
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
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first team member</p>
          <button
            onClick={handleCreate}
            className="btn-primary"
          >
            Add Team Member
          </button>
        </div>
      )}

      {/* Team Member Modal */}
      {showModal && (
        <TeamMemberModal
          member={selectedMember}
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  )
}