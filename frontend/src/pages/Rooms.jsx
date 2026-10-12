import { useEffect, useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  Building2,
  Search,
  Filter,
} from 'lucide-react'
import { roomApi, studentApi } from '../services/api'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { classNames } from '../utils/helpers'
import { roomStatusColors } from '../types'

const statusOptions = ['ALL', 'AVAILABLE', 'FULL', 'MAINTENANCE']

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [assigningRoom, setAssigningRoom] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formData, setFormData] = useState({ roomNumber: '', capacity: 2 })
  const [assignData, setAssignData] = useState({ studentId: '' })

  useEffect(() => {
    fetchRooms()
    fetchUnassignedStudents()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const data = await roomApi.getAll()
      setRooms(data)
    } catch (err) {
      setError(err.message || 'Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }

  const fetchUnassignedStudents = async () => {
    try {
      const data = await studentApi.getUnassigned()
      setStudents(data)
    } catch (err) {
      console.error('Failed to load unassigned students:', err)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await roomApi.create(formData)
      setShowCreateModal(false)
      setFormData({ roomNumber: '', capacity: 2 })
      fetchRooms()
    } catch (err) {
      setError(err.message || 'Failed to create room')
    }
  }

  const handleUpdateStatus = async (room, newStatus) => {
    try {
      await roomApi.updateStatus(room.id, newStatus)
      fetchRooms()
    } catch (err) {
      setError(err.message || 'Failed to update room status')
    }
  }

  const handleAssignStudent = async (e) => {
    e.preventDefault()
    try {
      await studentApi.assignRoom(assignData.studentId, assigningRoom.roomNumber)
      setAssigningRoom(null)
      setAssignData({ studentId: '' })
      fetchRooms()
      fetchUnassignedStudents()
    } catch (err) {
      setError(err.message || 'Failed to assign student')
    }
  }

  const handleUnassignStudent = async (roomNumber) => {
    try {
      const roomStudents = rooms.find(r => r.roomNumber === roomNumber)
      // This would need a proper unassign API call
      fetchRooms()
    } catch (err) {
      setError(err.message || 'Failed to unassign student')
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await roomApi.delete(confirmDelete.id)
      setConfirmDelete(null)
      fetchRooms()
    } catch (err) {
      setError(err.message || 'Failed to delete room')
    }
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || room.status === statusFilter
    return matchesSearch && matchesStatus
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
            <Building2 className="h-6 w-6 text-primary-600" />
            Room Management
          </h1>
          <p className="text-gray-500 mt-1">Manage hostel rooms and allocations</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="card">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input max-w-xs"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="table-container">
          <table className="table" role="table">
            <thead>
              <tr>
                <th scope="col">Room Number</th>
                <th scope="col">Capacity</th>
                <th scope="col">Occupancy</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No rooms found</p>
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id}>
                    <td className="font-medium">{room.roomNumber}</td>
                    <td>{room.capacity}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{room.currentOccupancy} / {room.capacity}</span>
                        <div className="h-2 bg-gray-200 rounded-full flex-1 max-w-24 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              room.currentOccupancy === room.capacity ? 'bg-danger-500' :
                              room.currentOccupancy > 0 ? 'bg-warning-500' : 'bg-success-500'
                            }`}
                            style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={classNames('badge', roomStatusColors[room.status])}>
                        {room.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {room.status === 'AVAILABLE' && room.currentOccupancy < room.capacity && (
                          <button
                            onClick={() => {
                              setAssigningRoom(room)
                              setAssignData({ studentId: '' })
                            }}
                            className="btn-success text-xs p-1.5"
                            title="Assign Student"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {room.currentOccupancy > 0 && (
                          <button
                            onClick={() => handleUnassignStudent(room.roomNumber)}
                            className="btn-warning text-xs p-1.5"
                            title="Unassign Student"
                          >
                            <UserMinus className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingRoom(room)
                            const newStatus = room.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE'
                            handleUpdateStatus(room, newStatus)
                          }}
                          className="btn-ghost text-xs p-1.5"
                          title={room.status === 'MAINTENANCE' ? 'Mark Available' : 'Mark Maintenance'}
                        >
                          <Building2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(room)}
                          className="btn-ghost text-danger-600 hover:bg-danger-50 text-xs p-1.5"
                          title="Delete Room"
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
        onClose={() => setShowCreateModal(false)}
        title="Add New Room"
      >
        <form onSubmit={handleCreate} className="space-y-4">
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
          <div className="modal-footer">
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">Create Room</button>
          </div>
        </form>
      </Modal>

      {assigningRoom && (
        <Modal
          isOpen={!!assigningRoom}
          onClose={() => setAssigningRoom(null)}
          title={`Assign Student to Room ${assigningRoom.roomNumber}`}
        >
          <form onSubmit={handleAssignStudent} className="space-y-4">
            <div>
              <label htmlFor="studentId" className="label">Select Student</label>
              <select
                id="studentId"
                value={assignData.studentId}
                onChange={(e) => setAssignData({ ...assignData, studentId: e.target.value })}
                className="input"
                required
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
              {students.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No unassigned students available</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" onClick={() => setAssigningRoom(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={!assignData.studentId}>
                Assign
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Room"
        message={`Are you sure you want to delete room ${confirmDelete?.roomNumber}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}