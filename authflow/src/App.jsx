import { useEffect, useState } from 'react'
import Login from './Login.jsx'
import Register from './Register.jsx'

const USERS_KEY = 'authflow_users'
const SESSION_KEY = 'authflow_current_user'

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export default function App() {
  const [view, setView] = useState('login')
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const storedUsers = readStorage(USERS_KEY, [])
    const session = readStorage(SESSION_KEY, null)
    setUsers(storedUsers)
    if (session && storedUsers.some((user) => user.id === session.id)) {
      setCurrentUser(session)
      setView('authenticated')
    }
  }, [])

  const handleRegister = (user) => {
    const updatedUsers = [...users, user]
    setUsers(updatedUsers)
    writeStorage(USERS_KEY, updatedUsers)
  }

  const handleLogin = (email, password) => {
    const user = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password)
    if (!user) return false
    const session = { id: user.id, name: user.name, email: user.email }
    writeStorage(SESSION_KEY, session)
    setCurrentUser(session)
    setView('authenticated')
    return true
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY)
    setCurrentUser(null)
    setView('login')
  }

  return (
    <main className="authflow-app">
      <section className="authflow-card">
        <header className="authflow-brand">
          <div className="authflow-brand__mark">
            <span className="authflow-brand__logo">AF</span>
            <span className="authflow-brand__name">Auth<span>Flow</span></span>
          </div>
          <span className="authflow-brand__tagline">Simple. Secure. Seamless.</span>
        </header>

        {view === 'authenticated' && currentUser ? (
          <div className="authflow-dashboard">
            <h1 className="authflow-dashboard__greeting">Welcome back, <span>{currentUser.name}</span></h1>
            <p className="authflow-dashboard__sub">You are signed in to your account.</p>
            <hr className="authflow-dashboard__divider" />
            <div className="authflow-dashboard__info">
              <div className="authflow-dashboard__info-item"><span className="authflow-dashboard__info-label">Name</span><strong>{currentUser.name}</strong></div>
              <div className="authflow-dashboard__info-item"><span className="authflow-dashboard__info-label">Email</span><strong>{currentUser.email}</strong></div>
              <div className="authflow-dashboard__info-item"><span className="authflow-dashboard__info-label">Status</span><span className="authflow-dashboard__status">Authenticated</span></div>
            </div>
            <button type="button" className="authflow-btn authflow-btn--danger" onClick={handleLogout}>Sign Out</button>
          </div>
        ) : view === 'login' ? (
          <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />
        ) : (
          <Register users={users} onRegister={handleRegister} onSwitchToLogin={() => setView('login')} />
        )}
      </section>
    </main>
  )
}
