import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message))
    }
    if (error.message === 'Network Error' || !error.response) {
      return Promise.reject(new Error('Network error - please check your connection'))
    }
    return Promise.reject(new Error(error.message || 'An unexpected error occurred'))
  }
)

export const studentApi = {
  getAll: () => api.get('/students').then(res => res.data.data),
  getById: (id) => api.get(`/students/${id}`).then(res => res.data.data),
  create: (data) => api.post('/students', data).then(res => res.data.data),
  update: (id, data) => api.put(`/students/${id}`, data).then(res => res.data.data),
  delete: (id) => api.delete(`/students/${id}`).then(res => res.data),
  assignRoom: (id, roomNumber) => api.post(`/students/${id}/assign-room`, { roomNumber }).then(res => res.data.data),
  unassignRoom: (id) => api.delete(`/students/${id}/unassign-room`).then(res => res.data.data),
  getUnassigned: () => api.get('/students/unassigned').then(res => res.data.data),
  getByFeeStatus: (status) => api.get(`/students/fee-status/${status}`).then(res => res.data.data),
}

export const roomApi = {
  getAll: () => api.get('/rooms').then(res => res.data.data),
  getById: (id) => api.get(`/rooms/${id}`).then(res => res.data.data),
  getByNumber: (roomNumber) => api.get(`/rooms/number/${roomNumber}`).then(res => res.data.data),
  create: (data) => api.post('/rooms', data).then(res => res.data.data),
  update: (id, data) => api.put(`/rooms/${id}`, data).then(res => res.data.data),
  updateStatus: (id, status) => api.patch(`/rooms/${id}/status`, null, { params: { status } }).then(res => res.data.data),
  delete: (id) => api.delete(`/rooms/${id}`).then(res => res.data),
  getAvailable: () => api.get('/rooms/available').then(res => res.data.data),
  getByStatus: (status) => api.get(`/rooms/status/${status}`).then(res => res.data.data),
}

export const messApi = {
  getAll: () => api.get('/mess').then(res => res.data.data),
  getByDate: (date, mealType) => {
    const url = mealType 
      ? `/mess/date/${date}/meal/${mealType}` 
      : `/mess/date/${date}`
    return api.get(url).then(res => res.data.data)
  },
  getByDateAndMeal: (date, mealType) => api.get(`/mess/date/${date}/meal/${mealType}`).then(res => res.data.data),
  getByStudent: (studentId) => api.get(`/mess/student/${studentId}`).then(res => res.data.data),
  markAttendance: (data) => api.post('/mess', data).then(res => res.data.data),
  delete: (id) => api.delete(`/mess/${id}`).then(res => res.data),
  getTodayCount: () => api.get('/mess/today/count').then(res => res.data.data),
  getMealCount: (date, mealType) => api.get(`/mess/date/${date}/meal/${mealType}/count`).then(res => res.data.data),
  getMonthlyBill: (studentId, year, month) => api.get(`/mess/bill/student/${studentId}/month/${year}/${month}`).then(res => res.data.data),
  getAllMonthlyBills: (year, month) => api.get(`/mess/bill/month/${year}/${month}`).then(res => res.data.data),
}

export const complaintApi = {
  getAll: (params) => api.get('/complaints', { params }).then(res => res.data.data),
  getById: (id) => api.get(`/complaints/${id}`).then(res => res.data.data),
  getByStudent: (studentId) => api.get(`/complaints/student/${studentId}`).then(res => res.data.data),
  getByStatus: (status) => api.get(`/complaints/status/${status}`).then(res => res.data.data),
  create: (data) => api.post('/complaints', data).then(res => res.data.data),
  update: (id, data) => api.patch(`/complaints/${id}`, data).then(res => res.data.data),
  delete: (id) => api.delete(`/complaints/${id}`).then(res => res.data),
  getPendingCount: () => api.get('/complaints/stats/pending').then(res => res.data.data),
  getInProgressCount: () => api.get('/complaints/stats/in-progress').then(res => res.data.data),
  getResolvedCount: () => api.get('/complaints/stats/resolved').then(res => res.data.data),
}

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats').then(res => res.data.data),
}

export default api