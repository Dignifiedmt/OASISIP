import { useState } from 'react'

function EyeIcon({ hidden = false }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    const normalizedEmail = email.trim()
    if (!normalizedEmail) return setError('Please enter your email address.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return setError('Please enter a valid email address.')
    if (!password) return setError('Please enter your password.')

    setError('')
    setIsSubmitting(true)
    window.setTimeout(() => {
      const success = onLogin(normalizedEmail, password, remember)
      setIsSubmitting(false)
      if (!success) setError('Invalid email or password.')
    }, 300)
  }

  const clearError = (setter) => (event) => {
    setter(event.target.value)
    if (error) setError('')
  }

  return (
    <form className="authflow-form" onSubmit={handleSubmit} noValidate>
      <div>
        <h2 className="authflow-form__title">Welcome Back</h2>
        <p className="authflow-form__subtitle">Sign in to your AuthFlow account.</p>
      </div>
      {error && <div className="authflow-message authflow-message--error" role="alert">{error}</div>}
      <div className="authflow-field">
        <label htmlFor="login-email" className="authflow-field__label">Email Address</label>
        <input id="login-email" type="email" className="authflow-field__input" placeholder="you@example.com" value={email} onChange={clearError(setEmail)} autoComplete="email" disabled={isSubmitting} />
      </div>
      <div className="authflow-field">
        <label htmlFor="login-password" className="authflow-field__label">Password</label>
        <div className="authflow-field__input-wrapper">
          <input id="login-password" type={showPassword ? 'text' : 'password'} className="authflow-field__input" placeholder="Enter your password" value={password} onChange={clearError(setPassword)} autoComplete="current-password" disabled={isSubmitting} />
          <button type="button" className="authflow-field__toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}><EyeIcon hidden={showPassword} /></button>
        </div>
      </div>
      <label className="authflow-remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} disabled={isSubmitting} /> Remember me</label>
      <button type="submit" className="authflow-btn authflow-btn--primary" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign In'}</button>
      <div className="authflow-switch">Don't have an account? <button type="button" onClick={onSwitchToRegister} disabled={isSubmitting}>Create one</button></div>
    </form>
  )
}