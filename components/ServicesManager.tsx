'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Settings, DollarSign } from 'lucide-react'
import { getServices, deleteService } from '@/lib/cosmic'
import type { Service } from '@/types'
import LoadingSpinner from './LoadingSpinner'
import ServiceModal from './ServiceModal'

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      setLoading(true)
      const data = await getServices()
      setServices(data)
    } catch (err) {
      setError('Failed to load services')
      console.error('Services error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(service: Service) {
    if (!confirm(`Are you sure you want to delete "${service.title}"?`)) {
      return
    }

    try {
      await deleteService(service.id)
      setServices(services.filter(s => s.id !== service.id))
    } catch (error) {
      alert('Failed to delete service')
      console.error('Delete error:', error)
    }
  }

  function handleCreate() {
    setSelectedService(null)
    setModalMode('create')
    setShowModal(true)
  }

  function handleEdit(service: Service) {
    setSelectedService(service)
    setModalMode('edit')
    setShowModal(true)
  }

  function handleModalSuccess(service: Service) {
    if (modalMode === 'create') {
      setServices([service, ...services])
    } else {
      setServices(services.map(s => s.id === service.id ? service : s))
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
          <div className="text-red-600 mb-2">Error loading services</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchServices}
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
          <h2 className="text-2xl font-bold text-gray-900">Services</h2>
          <p className="text-gray-600">{services.length} services total</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="content-grid">
          {services.map((service) => (
            <div key={service.id} className="card hover:shadow-md transition-shadow">
              {/* Service Icon */}
              {service.metadata?.service_icon && (
                <div className="mb-4">
                  <img
                    src={`${service.metadata.service_icon.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
                    alt={service.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.metadata?.service_name || service.title}
                </h3>
                
                {service.metadata?.short_description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {service.metadata.short_description}
                  </p>
                )}

                {service.metadata?.starting_price && (
                  <div className="flex items-center gap-1 text-sm text-green-600 mb-3">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">{service.metadata.starting_price}</span>
                  </div>
                )}

                {service.metadata?.key_features && service.metadata.key_features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Key Features:</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {service.metadata.key_features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                      {service.metadata.key_features.length > 3 && (
                        <li className="text-gray-400">
                          +{service.metadata.key_features.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service)}
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
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first service</p>
          <button
            onClick={handleCreate}
            className="btn-primary"
          >
            Add Service
          </button>
        </div>
      )}

      {/* Service Modal */}
      {showModal && (
        <ServiceModal
          service={selectedService}
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  )
}