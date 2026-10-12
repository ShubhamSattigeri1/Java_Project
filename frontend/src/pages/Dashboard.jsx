import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Building2,
  Utensils,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { dashboardApi } from '../services/api'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { classNames } from '../utils/helpers'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await dashboardApi.getStats()
      setStats(data)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const quickActions = [
    { name: 'Add Student', action: () => navigate('/students/new'), icon: Users, color: 'bg-primary-100 text-primary-600' },
    { name: 'Add Room', action: () => navigate('/rooms/new'), icon: Building2, color: 'bg-success-100 text-success-600' },
    { name: 'Log Attendance', action: () => navigate('/mess/log'), icon: Utensils, color: 'bg-warning-100 text-warning-600' },
    { name: 'Raise Complaint', action: () => navigate('/complaints/new'), icon: FileText, color: 'bg-danger-100 text-danger-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of hostel operations</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          iconColor="blue"
          onClick={() => navigate('/students')}
        />
        <StatCard
          title="Occupied Rooms"
          value={stats?.occupiedRooms || 0}
          icon={Building2}
          iconColor="green"
          trend={stats?.totalRooms ? Math.round(((stats.occupiedRooms / stats.totalRooms) * 100)) : 0}
          trendLabel="occupancy rate"
          onClick={() => navigate('/rooms')}
        />
        <StatCard
          title="Today's Mess Count"
          value={stats?.todaysMessCount || 0}
          icon={Utensils}
          iconColor="yellow"
          onClick={() => navigate('/mess')}
        />
        <StatCard
          title="Open Complaints"
          value={(stats?.pendingComplaints || 0) + (stats?.inProgressComplaints || 0)}
          icon={FileText}
          iconColor="red"
          onClick={() => navigate('/complaints')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  onClick={action.action}
                  className={classNames(
                    'flex items-center gap-4 p-4 rounded-lg border border-gray-200',
                    'hover:border-primary-300 hover:shadow-md transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                  )}
                >
                  <div className={`p-3 rounded-xl ${action.color}`}>
                    <action.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.name}</p>
                    <p className="text-sm text-gray-500">Click to proceed</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Room Status</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Available</span>
                <span className="font-medium text-gray-900">{stats?.availableRooms || 0}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success-500 rounded-full transition-all"
                  style={{ width: stats?.totalRooms ? `${(stats.availableRooms / stats.totalRooms) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Occupied</span>
                <span className="font-medium text-gray-900">{stats?.occupiedRooms || 0}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-danger-500 rounded-full transition-all"
                  style={{ width: stats?.totalRooms ? `${(stats.occupiedRooms / stats.totalRooms) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Maintenance</span>
                <span className="font-medium text-gray-900">
                  {(stats?.totalRooms || 0) - (stats?.availableRooms || 0) - (stats?.occupiedRooms || 0)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning-500 rounded-full transition-all"
                  style={{ width: stats?.totalRooms ? `${(((stats.totalRooms || 0) - (stats.availableRooms || 0) - (stats.occupiedRooms || 0)) / stats.totalRooms) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Complaint Status Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-warning-50 rounded-xl">
              <p className="text-3xl font-bold text-warning-600">{stats?.pendingComplaints || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Pending</p>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-xl">
              <p className="text-3xl font-bold text-primary-600">{stats?.inProgressComplaints || 0}</p>
              <p className="text-sm text-gray-600 mt-1">In Progress</p>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-xl">
              <p className="text-3xl font-bold text-success-600">{stats?.resolvedComplaints || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Resolved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}