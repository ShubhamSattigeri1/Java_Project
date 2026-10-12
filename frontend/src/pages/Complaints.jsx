import { useEffect, useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Building2,
  Wrench,
  Wifi,
  Sparkles,
  MoreHorizontal,
} from 'lucide-react'
import { complaintApi, studentApi } from '../services/api'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { classNames } from '../utils/helpers'
import { formatDate, formatDateTime } from '../utils/helpers'
import {
  ComplaintCategory,
  ComplaintStatus,
  complaintCategoryLabels,
  complaintStatusColors,
} from '../types'

const categoryIcons = {
  [ComplaintCategory.PLUMBING]: Wrench,
  [ComplaintCategory.ELECTRICAL]: AlertCircle,
  [ComplaintCategory.CLEANING]: Sparkles,
  [ComplaintCategory.INTERNET]: Wifi,
  [ComplaintCategory.OTHER]: MoreHorizontal,
}

export default function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingComplaint, setEditingComplaint] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formData, setFormData] = useState({
    studentId: '',
    category: ComplaintCategory.OTHER,
    description: '',
  })
  const [updateData, setUpdateData] = useState({ status: ComplaintStatus.PENDING })

  useEffect(() => {
    fetchStudents()
    fetchComplaints()
  }, [page, statusFilter, categoryFilter])

  const fetchStudents = async () => {
    try {
      const data = await studentApi.getAll()
      setStudents(data)
    } catch (err) {
      console.error('Failed to load students:', err)
    }
  }

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const params = { page, size: 20 }
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (categoryFilter !== 'ALL') params.category = categoryFilter
      const data = await complaintApi.getAll(params)
      setComplaints(data.content)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err.message || 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await complaintApi.create(formData)
      setShowCreateModal(false)
      setFormData({ studentId: '', category: ComplaintCategory.OTHER, description: '' })
      fetchComplaints()
    } catch (err) {
      setError(err.message || 'Failed to create complaint')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingComplaint) return
    try {
      await complaintApi.update(editingComplaint.id, updateData)
      setEditingComplaint(null)
      fetchComplaints()
    } catch (err) {
      setError(err.message || 'Failed to update complaint')
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await complaintApi.delete(confirmDelete.id)
      setConfirmDelete(null)
      fetchComplaints()
    } catch (err) {
      setError(err.message || 'Failed to delete complaint')
    }
  }

  const openEditModal = (complaint) => {
    setEditingComplaint(complaint)
    setUpdateData({ status: complaint.status })
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
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
            <AlertCircle className="h-6 w-6 text-primary-600" />
            Complaint Registry
          </h1>
          <p className="text-gray-500 mt-1">Track and manage maintenance complaints</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Complaint
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="card">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(0)
              }}
              className="input w-auto"
            >
              <option value="ALL">All Status</option>
              <option value={ComplaintStatus.PENDING}>Pending</option>
              <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
              <option value={ComplaintStatus.RESOLVED}>Resolved</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(0)
              }}
              className="input w-auto"
            >
              <option value="ALL">All Categories</option>
              <option value={ComplaintCategory.PLUMBING}>Plumbing</option>
              <option value={ComplaintCategory.ELECTRICAL}>Electrical</option>
              <option value={ComplaintCategory.CLEANING}>Cleaning</option>
              <option value={ComplaintCategory.INTERNET}>Internet</option>
              <option value={ComplaintCategory.OTHER}>Other</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table" role="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Student</th>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No complaints found</p>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => {
                  const CategoryIcon = categoryIcons[complaint.category] || MoreHorizontal
                  return (
                    <tr key={complaint.id}>
                      <td className="font-mono text-sm text-gray-500">#{complaint.id}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{complaint.studentName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4 text-gray-400" />
                          <span className="capitalize">{complaintCategoryLabels[complaint.category]}</span>
                        </div>
                      </td>
                      <td className="max-w-xs truncate">{complaint.description}</td>
                      <td>
                        <span className={classNames('badge', complaintStatusColors[complaint.status])}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="text-sm text-gray-500">{formatDateTime(complaint.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(complaint)}
                            className="btn-ghost text-xs p-1.5"
                            title="Update Status"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(complaint)}
                            className="btn-ghost text-danger-600 hover:bg-danger-50 text-xs p-1.5"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-secondary text-sm px-3"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-secondary text-sm px-3"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setFormData({ studentId: '', category: ComplaintCategory.OTHER, description: '' })
        }}
        title="Raise New Complaint"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="studentId" className="label">Student</label>
            <select
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="input"
              required
            >
              <option value="">Select student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.roomNumber || 'Unassigned'})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="label">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
              required
            >
              <option value={ComplaintCategory.PLUMBING}>Plumbing</option>
              <option value={ComplaintCategory.ELECTRICAL}>Electrical</option>
              <option value={ComplaintCategory.CLEANING}>Cleaning</option>
              <option value={ComplaintCategory.INTERNET}>Internet</option>
              <option value={ComplaintCategory.OTHER}>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[100px] resize-y"
              placeholder="Describe the issue in detail..."
              required
            />
          </div>
          <div className="modal-footer">
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">Submit Complaint</button>
          </div>
        </form>
      </Modal>

      {editingComplaint && (
        <Modal
          isOpen={!!editingComplaint}
          onClose={() => setEditingComplaint(null)}
          title="Update Complaint Status"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{editingComplaint.studentName}</p>
              <p className="text-sm text-gray-500">{complaintCategoryLabels[editingComplaint.category]}</p>
              <p className="text-gray-600 mt-1">{editingComplaint.description}</p>
              <p className="text-xs text-gray-400 mt-1">Created: {formatDateTime(editingComplaint.createdAt)}</p>
            </div>
            <div>
              <label htmlFor="status" className="label">New Status</label>
              <select
                id="status"
                value={updateData.status}
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                className="input"
                required
              >
                <option value={ComplaintStatus.PENDING}>Pending</option>
                <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
                <option value={ComplaintStatus.RESOLVED}>Resolved</option>
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={() => setEditingComplaint(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">Update Status</button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Complaint"
        message={`Are you sure you want to delete this complaint? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}