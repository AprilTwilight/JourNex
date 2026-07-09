import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { GuestRoute, ProtectedRoute } from './auth/ProtectedRoute'
import { CustomerPage } from './pages/CustomerPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ManagementPage } from './pages/ManagementPage'
import { RegisterPage } from './pages/RegisterPage'
import { ServicePage } from './pages/ServicePage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/registrieren"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/kunde"
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <CustomerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flottenmanager"
            element={
              <ProtectedRoute allowedRoles={['Flottenmanager']}>
                <ManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service"
            element={
              <ProtectedRoute allowedRoles={['Service']}>
                <ServicePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
