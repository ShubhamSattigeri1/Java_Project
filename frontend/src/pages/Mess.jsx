import { useEffect, useState } from 'react'
import {
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Utensils,
  Sunrise,
  Sun,
  Moon,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { messApi, studentApi } from '../services/api'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { classNames } from '../utils/helpers'
import { formatDate, getTodayDateString, getMonthYearOptions, formatCurrency } from '../utils/helpers'
import { MealType, AttendanceStatus, mealTypeLabels, AttendanceStatusColors } from '../types'

const MEAL_TYPES = [
  { value: MealType.BREAKFAST, label: 'Breakfast', icon: Sunrise, color: 'bg-yellow-100 text-yellow-600' },
  { value: MealType.LUNCH, label: 'Lunch', icon: Sun, color: 'bg-orange-100 text-orange-600' },
  { value: MealType.DINNER, label: 'Dinner', icon: Moon, color: 'bg-purple-100 text-purple-600' },
]

export default function Mess() {
  const [attendance, setAttendance] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(getTodayDateString())
  const [selectedMealType, setSelectedMealType] = useState(MealType.BREAKFAST)
  const [showLogModal, setShowLogModal] = useState(false)
  const [showBillModal, setShowBillModal] = useState(false)
  const [billData, setBillData] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )
  const [formData, setFormData] = useState({
    studentId: '',
    date: getTodayDateString(),
    mealType: MealType.BREAKFAST,
    status: AttendanceStatus.PRESENT,
  })

  useEffect(() => {
    fetchStudents()
    fetchAttendance()
  }, [selectedDate, selectedMealType])

  useEffect(() => {
    if (showBillModal) {
      fetchAllMonthlyBills()
    }
  }, [showBillModal, selectedMonth])

  const fetchStudents = async () => {
    try {
      const data = await studentApi.getAll()
      setStudents(data)
    } catch (err) {
      console.error('Failed to load students:', err)
    }
  }

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      let data
      if (selectedMealType) {
        data = await messApi.getByDateAndMeal(selectedDate, selectedMealType)
      } else {
        data = await messApi.getByDate(selectedDate)
      }
      setAttendance(data)
    } catch (err) {
      setError(err.message || 'Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllMonthlyBills = async () => {
    try {
      const [year, month] = selectedMonth.split('-').map(Number)
      const data = await messApi.getAllMonthlyBills(year, month)
      setBillData(data)
    } catch (err) {
      setError(err.message || 'Failed to load monthly bills')
    }
  }

  const handleLogAttendance = async (e) => {
    e.preventDefault()
    try {
      await messApi.markAttendance(formData)
      setShowLogModal(false)
      setFormData({
        studentId: '',
        date: getTodayDateString(),
        mealType: MealType.BREAKFAST,
        status: AttendanceStatus.PRESENT,
      })
      fetchAttendance()
    } catch (err) {
      setError(err.message || 'Failed to log attendance')
    }
  }

  const handleQuickLog = async (studentId, mealType, status) => {
    try {
      await messApi.markAttendance({
        studentId,
        date: selectedDate,
        mealType,
        status,
      })
      fetchAttendance()
    } catch (err) {
      setError(err.message || 'Failed to log attendance')
    }
  }

  const isPresent = (studentId, mealType) => {
    return attendance.some(
      (a) => a.studentId === studentId && a.mealType === mealType && a.status === AttendanceStatus.PRESENT
    )
  }

  const getAttendanceStatus = (studentId, mealType) => {
    const record = attendance.find(
      (a) => a.studentId === studentId && a.mealType === mealType
    )
    return record?.status || null
  }

  const prevDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() - 1)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const nextDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + 1)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const todayAttendance = attendance.filter((a) => a.status === AttendanceStatus.PRESENT).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary-600" />
            Mess Tracker
          </h1>
          <p className="text-gray-500 mt-1">Track daily meal attendance and monthly bills</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowLogModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Log Attendance
          </button>
          <button
            onClick={() => setShowBillModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Monthly Bills
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={prevDay}
                className="btn-ghost p-2"
                aria-label="Previous day"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input w-auto px-3 py-1.5 text-sm"
                />
              </div>
              <button
                onClick={nextDay}
                className="btn-ghost p-2"
                aria-label="Next day"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Meal:</label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="input w-auto"
              >
                <option value="">All Meals</option>
                {MEAL_TYPES.map((meal) => (
                  <option key={meal.value} value={meal.value}>
                    {meal.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {MEAL_TYPES.map((meal) => {
              const count = attendance.filter(
                (a) => a.mealType === meal.value && a.status === AttendanceStatus.PRESENT
              ).length
              return (
                <div
                  key={meal.value}
                  className={classNames(
                    'p-4 rounded-xl text-center',
                    meal.color.replace('bg-', 'bg-').replace('text-', 'border-')
                  )}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <meal.icon className="h-5 w-5" />
                    <span className="font-medium">{meal.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-gray-500">Present</p>
                </div>
              )
            })}
          </div>

          <div className="table-container">
            <table className="table" role="table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  {MEAL_TYPES.map((meal) => (
                    <th key={meal.value} scope="col" className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <meal.icon className="h-4 w-4" />
                        <span>{meal.label}</span>
                      </div>
                    </th>
                  ))}
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                      <Utensils className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>No students found</p>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const breakfastStatus = getAttendanceStatus(student.id, MealType.BREAKFAST)
                    const lunchStatus = getAttendanceStatus(student.id, MealType.LUNCH)
                    const dinnerStatus = getAttendanceStatus(student.id, MealType.DINNER)
                    const totalPresent = [breakfastStatus, lunchStatus, dinnerStatus].filter(
                      (s) => s === AttendanceStatus.PRESENT
                    ).length
                    return (
                      <tr key={student.id}>
                        <td className="font-medium">{student.name}</td>
                        <td className="text-center">
                          <button
                            onClick={() =>
                              handleQuickLog(
                                student.id,
                                MealType.BREAKFAST,
                                breakfastStatus === AttendanceStatus.PRESENT
                                  ? AttendanceStatus.ABSENT
                                  : AttendanceStatus.PRESENT
                              )
                            }
                            className={classNames(
                              'w-10 h-10 rounded-full mx-auto transition-colors',
                              breakfastStatus === AttendanceStatus.PRESENT
                                ? 'bg-success-100 text-success-600 hover:bg-success-200'
                                : breakfastStatus === AttendanceStatus.ABSENT
                                ? 'bg-danger-100 text-danger-600 hover:bg-danger-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            )}
                            aria-label={`${mealTypeLabels[MealType.BREAKFAST]}: ${breakfastStatus || 'Not marked'}`}
                          >
                            {breakfastStatus === AttendanceStatus.PRESENT ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : breakfastStatus === AttendanceStatus.ABSENT ? (
                              <XCircle className="h-5 w-5" />
                            ) : (
                              <span className="text-xs">-</span>
                            )}
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() =>
                              handleQuickLog(
                                student.id,
                                MealType.LUNCH,
                                lunchStatus === AttendanceStatus.PRESENT
                                  ? AttendanceStatus.ABSENT
                                  : AttendanceStatus.PRESENT
                              )
                            }
                            className={classNames(
                              'w-10 h-10 rounded-full mx-auto transition-colors',
                              lunchStatus === AttendanceStatus.PRESENT
                                ? 'bg-success-100 text-success-600 hover:bg-success-200'
                                : lunchStatus === AttendanceStatus.ABSENT
                                ? 'bg-danger-100 text-danger-600 hover:bg-danger-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            )}
                            aria-label={`${mealTypeLabels[MealType.LUNCH]}: ${lunchStatus || 'Not marked'}`}
                          >
                            {lunchStatus === AttendanceStatus.PRESENT ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : lunchStatus === AttendanceStatus.ABSENT ? (
                              <XCircle className="h-5 w-5" />
                            ) : (
                              <span className="text-xs">-</span>
                            )}
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() =>
                              handleQuickLog(
                                student.id,
                                MealType.DINNER,
                                dinnerStatus === AttendanceStatus.PRESENT
                                  ? AttendanceStatus.ABSENT
                                  : AttendanceStatus.PRESENT
                              )
                            }
                            className={classNames(
                              'w-10 h-10 rounded-full mx-auto transition-colors',
                              dinnerStatus === AttendanceStatus.PRESENT
                                ? 'bg-success-100 text-success-600 hover:bg-success-200'
                                : dinnerStatus === AttendanceStatus.ABSENT
                                ? 'bg-danger-100 text-danger-600 hover:bg-danger-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            )}
                            aria-label={`${mealTypeLabels[MealType.DINNER]}: ${dinnerStatus || 'Not marked'}`}
                          >
                            {dinnerStatus === AttendanceStatus.PRESENT ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : dinnerStatus === AttendanceStatus.ABSENT ? (
                              <XCircle className="h-5 w-5" />
                            ) : (
                              <span className="text-xs">-</span>
                            )}
                          </button>
                        </td>
                        <td className="font-medium text-center">{totalPresent} / 3</td>
                      </tr>
                    )
                  )}
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Log Attendance"
      >
        <form onSubmit={handleLogAttendance} className="space-y-4">
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
            <label htmlFor="date" className="label">Date</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="mealType" className="label">Meal Type</label>
            <select
              id="mealType"
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              className="input"
              required
            >
              {MEAL_TYPES.map((meal) => (
                <option key={meal.value} value={meal.value}>
                  {meal.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="label">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input"
              required
            >
              <option value={AttendanceStatus.PRESENT}>Present</option>
              <option value={AttendanceStatus.ABSENT}>Absent</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={() => setShowLogModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">Log Attendance</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showBillModal}
        onClose={() => setShowBillModal(false)}
        title="Monthly Mess Bills"
        footer={
          <div className="flex justify-between items-center w-full">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input w-auto"
            >
              {getMonthYearOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setShowBillModal(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        }
      >
        {billData ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {billData.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No billing data for this month</p>
            ) : (
              billData.map((bill) => (
                <div
                  key={bill.studentId}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{bill.studentName}</p>
                      <p className="text-sm text-gray-500">Student ID: {bill.studentId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">{formatCurrency(bill.estimatedBill)}</p>
                      <p className="text-sm text-gray-500">Estimated Bill</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-white rounded">
                      <p className="font-medium text-success-600">{bill.breakfastCount}</p>
                      <p className="text-gray-500">Breakfast</p>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <p className="font-medium text-warning-600">{bill.lunchCount}</p>
                      <p className="text-gray-500">Lunch</p>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <p className="font-medium text-purple-600">{bill.dinnerCount}</p>
                      <p className="text-gray-500">Dinner</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Total Meals: {bill.totalMeals} • Period: {formatDate(bill.monthStart)} - {formatDate(bill.monthEnd)}
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        )}
      </Modal>
    </div>
  )
}