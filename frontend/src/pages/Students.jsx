import { useEffect, useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  Mail,
  Phone,
  Home,
  DollarSign,
} from 'lucide-react'
import { studentApi, roomApi } from '../services/api'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { classNames } from '../utils/helpers'
import { feeStatusColors, FeeStatus } from '../types'

export default function Students() {
  const [students, setStudents] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [feeStatusFilter, setFeeStatusFilter] = useState('ALL')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    feeStatus: FeeStatus.PENDING,
  })

  useEffect(() => {
    fetchStudents()
    fetchAvailableRooms()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await studentApi.getAll()
      setStudents(data)
    } catch (err) {
      setError(err.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableRooms = async () => {
    try {
      const data = await roomApi.getAvailable()
      setRooms(data)
    } catch (err) {
      console.error('Failed to load rooms:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingStudent) {
        await studentApi.update(editingStudent.id, formData)
      } else {
        await studentApi.create(formData)
      }
      setShowCreateModal(false)
      setEditingStudent(null)
      setFormData({ name: '', email: '', phone: '', feeStatus: FeeStatus.PENDING })
      fetchStudents()
    } catch (err) {
      setError(err.message || 'Failed to save student')
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await studentApi.delete(confirmDelete.id)
      setConfirmDelete(null)
      fetchStudents()
    } catch (err) {
      setError(err.message || 'Failed to delete student')
    }
  }

  const openEditModal = (student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      feeStatus: student.feeStatus,
    })
    setShowCreateModal(true)
  }

  const openCreateModal = () => {
    setEditingStudent(null)
    setFormData({ name: '', email: '', phone: '', feeStatus: FeeStatus.PENDING })
    setShowCreateModal(true)
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFeeStatus = feeStatusFilter === 'ALL' || student.feeStatus === feeStatusFilter
    return matchesSearch && matchesFeeStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6 text-primary-600" />
            Student Management
          </h1>
          <p className="text-gray-500 mt-1">Manage student records and room assignments</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="card">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={feeStatusFilter}
            onChange={(e) => setFeeStatusFilter(e.target.value)}
            className="input max-w-xs"
          >
            <option value="ALL">All Fee Status</option>
            <option value={FeeStatus.PAID}>Paid</option>
            <option value={FeeStatus.PENDING}>Pending</option>
            <option value={FeeStatus.OVERDUE}>Overdue</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table" role="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Room</th>
                <th scope="col">Fee Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No students found</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{student.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{student.phone || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-gray-400" />
                        <span className={student.roomNumber ? 'font-medium' : 'text-gray-500'}>
                          {student.roomNumber || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={classNames('badge', feeStatusColors[student.feeStatus])}>
                        {student.feeStatus}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(student)}
                          className="btn-ghost text-xs p-1.5"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(student)}
                          className="btn-ghost text-danger-600 hover:bg-danger-50 text-xs p-1.5"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setEditingStudent(null)
          setFormData({ name: '', email: '', phone: '', feeStatus: FeeStatus.PENDING })
        }}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="modal-footer">
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingStudent ? 'Update' : 'Create'} Student
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${confirmDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}