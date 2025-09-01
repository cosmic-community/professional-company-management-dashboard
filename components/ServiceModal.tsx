'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { createService, updateService } from '@/lib/cosmic'
import type { Service, ServiceFormData } from '@/types'

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service?: Service | null
  onServiceSaved: (service: Service) => void
}

export default function ServiceModal({ isOpen, onClose, service, onServiceSaved }: ServiceModalProps) {
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
  const [loading, setLoading] = useState(false)
  const [newFeature, setNewFeature] = useState('')

  useEffect(() => {
    if (service) {
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
    setNewFeature('')
  }, [service, isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      let savedService: Service
      if (service) {
        savedService = await updateService(service.id, formData)
      } else {
        savedService = await createService(formData)
      }
      
      onServiceSaved(savedService)
      onClose()
    } catch (error) {
      alert('Failed to save service')
      console.error('Save error:', error)
    } finally {
      setLoading(false)
    }
  }

  function addFeature() {
    if (newFeature.trim()) {
      const currentFeatures = formData.metadata.key_features || []
      setFormData({
        ...formData,
        metadata: {
          ...formData.metadata,
          key_features: [...currentFeatures, newFeature.trim()]
        }
      })
      setNewFeature('')
    }
  }

  function removeFeature(index: number) {
    const currentFeatures = formData.metadata.key_features || []
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        key_features: currentFeatures.filter((_, i) => i !== index)
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {service ? 'Edit Service' : 'Add New Service'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={formData.metadata.service_name}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, service_name: e.target.value }
                })}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                value={formData.metadata.short_description}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, short_description: e.target.value }
                })}
                rows={3}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description
              </label>
              <textarea
                value={formData.metadata.full_description}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, full_description: e.target.value }
                })}
                rows={5}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price
              </label>
              <input
                type="text"
                value={formData.metadata.starting_price}
                onChange={(e) => setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, starting_price: e.target.value }
                })}
                className="form-input"
                placeholder="e.g., From $2,500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Features
              </label>
              
              {/* Add Feature Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addFeature()
                    }
                  }}
                  className="form-input flex-1"
                  placeholder="Add a key feature..."
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="btn-secondary flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Features List */}
              {formData.metadata.key_features && formData.metadata.key_features.length > 0 && (
                <div className="space-y-2">
                  {(formData.metadata.key_features || []).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1 text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
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
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : service ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}