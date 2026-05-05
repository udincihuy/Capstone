import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TicketProvider } from './context/TicketContext'
import ProtectedRoute from './components/ProtectedRoute'

import LaporanPage from './pages/nasabah/LaporanPage'
import EdukasiPage from './pages/nasabah/EdukasiPage'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import TicketingPage from './pages/admin/TicketingPage'
import TicketDetailPage from './pages/admin/TicketDetailPage'

export default function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/laporan" replace />} />
            <Route path="/laporan" element={<LaporanPage />} />
            <Route path="/edukasi" element={<EdukasiPage />} />
            <Route path="/admin" element={<LoginPage />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/ticketing" element={<ProtectedRoute><TicketingPage /></ProtectedRoute>} />
            <Route path="/admin/ticketing/:id" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/laporan" replace />} />
          </Routes>
        </BrowserRouter>
      </TicketProvider>
    </AuthProvider>
  )
}
