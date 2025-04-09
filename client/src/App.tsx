import { Routes, Route, Navigate } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './routes/login'
import { routes } from './routes/_index'
import { UIRoot } from './lib/ui'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute>
                {route.Element}
              </ProtectedRoute>
            }
          />
        ))}
        
        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <UIRoot />
    </div>
  )
}

export default App
