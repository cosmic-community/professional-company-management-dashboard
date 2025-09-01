'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { createService, updateService } from '@/lib/cosmic'
import type { Service, ServiceFormData } from '@/types'

export interface ServiceModalProps {
  service: Service | null
  mode: 'create' | 'edit'
  onClose: () => void
  onSuccess: (service: Service) => void
}

export default function ServiceModal({ service, mode, onClose, onSuccess }: ServiceModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    metadata: {
      service_name: '',
      short_description: '',
      full_description: '',
      starting_price: '',
      key_features: []
    }
  })
  const [keyFeature, setKeyFeature] = useState('')

  useEffect(() => {
    if (service && mode === 'edit') {
      setFormData({
        title: service.title,
        metadata: {
          service_name: service.metadata?.service_name || '',
          short_description: service.metadata?.short_description || '',
          full_description: service.metadata?.full_description || '',
          starting_price: service.metadata?.starting_price || '',
          key_features: service.metadata?.key_features || []
        }
      })
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        metadata: {
          service_name: '',
          short_description: '',
          full_description: '',
          starting_price: '',
          key_features: []
        }
      })
    }
  }, [service, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.metadata.service_name.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      let result: Service
      
      if (mode === 'edit' && service) {
        result = await updateService(service.id, formData)
      } else {
        result = await createService(formData)
      }
      
      onSuccess(result)
      onClose()
    } catch (error) {
      console.error('Error saving service:', error)
      alert(`Failed to ${mode === 'edit' ? 'update' : 'create'} service`)
    } finally {
      setLoading(false)
    }
  }

  const addKeyFeature = () => {
    if (keyFeature.trim() && !formData.metadata.key_features?.includes(keyFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          key_features: [...(prev.metadata.key_features || []), keyFeature.trim()]
        }
      }))
      setKeyFeature('')
    }
  }

  const removeKeyFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        key_features: prev.metadata.key_features?.filter((_, i) => i !== index) || []
      }
    }))
  }

  const handleKeyFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyFeature()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input"
              placeholder="e.g., Web Development"
              required
              disabled={loading}
            />
          </div>

          {/* Service Name */}
          <div>
            <label htmlFor="service_name" className="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              type="text"
              id="service_name"
              value={formData.metadata.service_name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, service_name: e.target.value }
              }))}
              className="input"
              placeholder="e.g., Web Development"
              required
              disabled={loading}
            />
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              id="short_description"
              value={formData.metadata.short_description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, short_description: e.target.value }
              }))}
              className="input"
              rows={2}
              placeholder="Brief description of the service..."
              disabled={loading}
            />
          </div>

          {/* Full Description */}
          <div>
            <label htmlFor="full_description" className="block text-sm font-medium text-gray-700 mb-2">
              Full Description
            </label>
            <textarea
              id="full_description"
              value={formData.metadata.full_description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, full_description: e.target.value }
              }))}
              className="input"
              rows={4}
              placeholder="Detailed description of the service..."
              disabled={loading}
            />
          </div>

          {/* Starting Price */}
          <div>
            <label htmlFor="starting_price" className="block text-sm font-medium text-gray-700 mb-2">
              Starting Price
            </label>
            <input
              type="text"
              id="starting_price"
              value={formData.metadata.starting_price}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, starting_price: e.target.value }
              }))}
              className="input"
              placeholder="e.g., From $2,500"
              disabled={loading}
            />
          </div>

          {/* Key Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Features
            </label>
            
            {/* Add new feature */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={keyFeature}
                onChange={(e) => setKeyFeature(e.target.value)}
                onKeyPress={handleKeyFeatureKeyPress}
                className="input flex-1"
                placeholder="Add a key feature..."
                disabled={loading}
              />
              <button
                type="button"
                onClick={addKeyFeature}
                disabled={!keyFeature.trim() || loading}
                className="btn-secondary"
              >
                Add
              </button>
            </div>

            {/* Feature list */}
            {formData.metadata.key_features && formData.metadata.key_features.length > 0 && (
              <div className="space-y-2">
                {formData.metadata.key_features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="flex-1 text-sm">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyFeature(index)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.metadata.service_name.trim()}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {mode === 'edit' ? 'Update Service' : 'Create Service'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}