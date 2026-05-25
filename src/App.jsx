import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Landing from './components/Landing'
import Auth from './components/Auth'
import CreateDeal from './components/CreateDeal'
import Dashboard from './components/Dashboard'
import DealDetail from './components/DealDetail'
import AdminPanel from './components/AdminPanel'
import { getUser } from './api/client'

function ProtectedRoute({ children, adminOnly = false }) {
  const user = getUser()
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />
  return children
}

function Layout({ children }) {
  return (
    <>
      <Nav />
      {children}
    </>
  )
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f3', width: '100%' }}>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/create" element={<Layout><ProtectedRoute><CreateDeal /></ProtectedRoute></Layout>} />
        <Route path="/deals" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
        <Route path="/deals/:id" element={<Layout><ProtectedRoute><DealDetail /></ProtectedRoute></Layout>} />
        <Route path="/admin" element={<Layout><ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute></Layout>} />
      </Routes>
    </div>
  )
}
