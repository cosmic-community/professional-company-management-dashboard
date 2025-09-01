'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createTeamMember, updateTeamMember } from '@/lib/cosmic'
import type { TeamMember, TeamMemberFormData } from '@/types'

interface TeamMemberModalProps {
  member: TeamMember | null
  mode: 'create' | 'edit'
  onClose: () => void
  onSuccess: (member: TeamMember) => void
}

export default function TeamMemberModal({ member, mode, onClose, onSuccess }: TeamMemberModalProps) {
  const [formData, setFormData] = useState<TeamMemberFormData>({
    title: member?.title || '',
    metadata: {
      full_name: member?.metadata?.full_name || '',
      job_title: member?.metadata?.job_title || '',
      bio: member?.metadata?.bio || '',
      email: member?.metadata?.email || '',
      linkedin_url: member?.metadata?.linkedin_url || '',
      twitter_handle: member?.metadata?.twitter_handle || '',
      years_experience: member?.metadata?.years_experience || undefined,
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.metadata.full_name.trim() || !formData.metadata.job_title.trim()) {
      setError('Title, full name, and job title are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      let result: TeamMember

      if (mode === 'create') {
        result = await createTeamMember(formData)
      } else if (member) {
        result = await updateTeamMember(member.id, formData)
      } else {
        throw new Error('No team member to update')
      }

      onSuccess(result)
    } catch (err) {
      setError('Failed to save team member')
      console.error('Save error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Add Team Member' : 'Edit Team Member'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="label">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Enter title for the system"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Full Name *</label>
              <input
                type="text"
                value={formData.metadata.full_name}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, full_name: e.target.value }
                })}
                className="input-field"
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Job Title *</label>
              <input
                type="text"
                value={formData.metadata.job_title}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, job_title: e.target.value }
                })}
                className="input-field"
                placeholder="Enter job title"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Bio</label>
            <textarea
              value={formData.metadata.bio}
              onChange={(e) => setFormData({
                ...formData,
                metadata: { ...formData.metadata, bio: e.target.value }
              })}
              className="textarea-field"
              placeholder="Professional biography"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Email</label>
              <input
                type="email"
                value={formData.metadata.email}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, email: e.target.value }
                })}
                className="input-field"
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label className="label">Years of Experience</label>
              <input
                type="number"
                value={formData.metadata.years_experience || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { 
                    ...formData.metadata, 
                    years_experience: e.target.value ? parseInt(e.target.value) : undefined 
                  }
                })}
                className="input-field"
                placeholder="Enter years of experience"
                min="0"
                max="50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">LinkedIn URL</label>
              <input
                type="url"
                value={formData.metadata.linkedin_url}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, linkedin_url: e.target.value }
                })}
                className="input-field"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="form-group">
              <label className="label">Twitter Handle</label>
              <input
                type="text"
                value={formData.metadata.twitter_handle}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, twitter_handle: e.target.value }
                })}
                className="input-field"
                placeholder="username (without @)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Saving...' : mode === 'create' ? 'Create Member' : 'Update Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}