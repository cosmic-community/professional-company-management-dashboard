'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { createService, updateService } from '@/lib/cosmic'
import type { Service, ServiceFormData } from '@/types'

interface ServiceModalProps {
  service: Service | null
  mode: 'create' | 'edit'
  onClose: () => void
  onSuccess: (service: Service) => void
}

export default function ServiceModal({ service, mode, onClose, onSuccess }: ServiceModalProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: service?.title || '',
    metadata: {
      service_name: service?.metadata?.service_name || '',
      short_description: service?.metadata?.short_description || '',
      full_description: service?.metadata?.full_description || '',
      starting_price: service?.metadata?.starting_price || '',
      key_features: service?.metadata?.key_features || [],
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.metadata.service_name.trim()) {
      setError('Title and service name are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      let result: Service

      if (mode === 'create') {
        result = await createService(formData)
      } else if (service) {
        result = await updateService(service.id, formData)
      } else {
        throw new Error('No service to update')
      }

      onSuccess(result)
    } catch (err) {
      setError('Failed to save service')
      console.error('Save error:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyFeatureChange(index: number, value: string) {
    const newFeatures = [...formData.metadata.key_features]
    newFeatures[index] = value
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        key_features: newFeatures
      }
    })
  }

  function addKeyFeature() {
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        key_features: [...formData.metadata.key_features, '']
      }
    })
  }

  function removeKeyFeature(index: number) {
    const newFeatures = formData.metadata.key_features.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        key_features: newFeatures
      }
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Add Service' : 'Edit Service'}
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
              placeholder="Enter service title"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Service Name *</label>
            <input
              type="text"
              value={formData.metadata.service_name}
              onChange={(e) => setFormData({
                ...formData,
                metadata: { ...formData.metadata, service_name: e.target.value }
              })}
              className="input-field"
              placeholder="Enter service name"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Short Description</label>
            <textarea
              value={formData.metadata.short_description}
              onChange={(e) => setFormData({
                ...formData,
                metadata: { ...formData.metadata, short_description: e.target.value }
              })}
              className="textarea-field"
              placeholder="Brief description for listings and previews"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="label">Full Description</label>
            <textarea
              value={formData.metadata.full_description}
              onChange={(e) => setFormData({
                ...formData,
                metadata: { ...formData.metadata, full_description: e.target.value }
              })}
              className="textarea-field"
              placeholder="Detailed service description"
              rows={5}
            />
          </div>

          <div className="form-group">
            <label className="label">Starting Price</label>
            <input
              type="text"
              value={formData.metadata.starting_price}
              onChange={(e) => setFormData({
                ...formData,
                metadata: { ...formData.metadata, starting_price: e.target.value }
              })}
              className="input-field"
              placeholder="e.g., 'From $2,500' or 'Contact for quote'"
            />
          </div>

          <div className="form-group">
            <label className="label">Key Features</label>
            <div className="space-y-2">
              {formData.metadata.key_features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleKeyFeatureChange(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="Enter key feature"
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyFeature(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addKeyFeature}
                className="btn-secondary"
              >
                Add Feature
              </button>
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
              {loading ? 'Saving...' : mode === 'create' ? 'Create Service' : 'Update Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}