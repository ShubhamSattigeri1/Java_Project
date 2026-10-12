import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Rooms from './pages/Rooms'
import Students from './pages/Students'
import StudentForm from './pages/StudentForm'
import RoomForm from './pages/RoomForm'
import Mess from './pages/Mess'
import MessLogForm from './pages/MessLogForm'
import Complaints from './pages/Complaints'
import ComplaintForm from './pages/ComplaintForm'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/new" element={<RoomForm />} />
          <Route path="rooms/:id/edit" element={<RoomForm />} />
          <Route path="students" element={<Students />} />
          <Route path="students/new" element={<StudentForm />} />
          <Route path="students/:id/edit" element={<StudentForm />} />
          <Route path="mess" element={<Mess />} />
          <Route path="mess/log" element={<MessLogForm />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="complaints/new" element={<ComplaintForm />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App