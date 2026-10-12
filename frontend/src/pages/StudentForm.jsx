import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Edit, ArrowLeft, User, Mail, Phone, DollarSign } from 'lucide-react'
import { studentApi } from '../services/api'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { classNames } from '../utils/helpers'
import { feeStatusColors, FeeStatus } from '../types'

export default function StudentForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    feeStatus: FeeStatus.PENDING,
  })
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEditing) {
      fetchStudent()
    }
  }, [id])

  const fetchStudent = async () => {
    try {
      const data = await studentApi.getById(id)
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        feeStatus: data.feeStatus,
      })
    } catch (err) {
      setError(err.message || 'Failed to load student')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEditing) {
        await studentApi.update(id, formData)
      } else {
        await studentApi.create(formData)
      }
      navigate(-1)
    } catch (err) {
      setError(err.message || 'Failed to save student')
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
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2" aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6 text-primary-600" />
            {isEditing ? 'Edit Student' : 'Add New Student'}
          </h1>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="card">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="label">Full Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Enter full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="student@college.edu"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="label">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input"
              placeholder="9876543210"
            />
          </div>
          <div>
            <label htmlFor="feeStatus" className="label">Fee Status</label>
            <select
              id="feeStatus"
              value={formData.feeStatus}
              onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value })}
              className="input"
            >
              <option value={FeeStatus.PENDING}>Pending</option>
              <option value={FeeStatus.PAID}>Paid</option>
              <option value={FeeStatus.OVERDUE}>Overdue</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}