import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Building2, ArrowLeft } from 'lucide-react'
import { roomApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { classNames } from '../utils/helpers'
import { RoomStatus } from '../types'

export default function RoomForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: 2,
  })
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEditing) {
      fetchRoom()
    }
  }, [id])

  const fetchRoom = async () => {
    try {
      const data = await roomApi.getById(id)
      setFormData({
        roomNumber: data.roomNumber,
        capacity: data.capacity,
      })
    } catch (err) {
      setError(err.message || 'Failed to load room')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEditing) {
        await roomApi.update(id, formData)
      } else {
        await roomApi.create(formData)
      }
      navigate(-1)
    } catch (err) {
      setError(err.message || 'Failed to save room')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2" aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary-600" />
            {isEditing ? 'Edit Room' : 'Add New Room'}
          </h1>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="card">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="roomNumber" className="label">Room Number</label>
            <input
              id="roomNumber"
              type="text"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="input"
              placeholder="e.g., 101"
              required
              disabled={isEditing}
            />
          </div>
          <div>
            <label htmlFor="capacity" className="label">Capacity</label>
            <select
              id="capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="input"
            >
              <option value={1}>1 Seater</option>
              <option value={2}>2 Seater</option>
              <option value={3}>3 Seater</option>
              <option value={4}>4 Seater</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')} Room
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}