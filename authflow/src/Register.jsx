import { useState } from 'react'

function EyeIcon({ hidden = false }) {
  return hidden ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
}

export default function Register({ users, onRegister, onSwitchToLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [visible, setVisible] = useState({ password: false, confirm: false })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim()
    if (!name) return setError('Please enter your full name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) return setError('An account with this email already exists.')

    setError('')
    setIsSubmitting(true)
    window.setTimeout(() => {
      onRegister({ id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, name, email, password: form.password })
      setIsSubmitting(false)
      onSwitchToLogin()
    }, 300)
  }

  return (
    <form className="authflow-form" onSubmit={handleSubmit} noValidate>
      <div><h2 className="authflow-form__title">Create Account</h2><p className="authflow-form__subtitle">Join AuthFlow - it's free.</p></div>
      {error && <div className="authflow-message authflow-message--error" role="alert">{error}</div>}
      <div className="authflow-field"><label htmlFor="register-name" className="authflow-field__label">Full Name</label><input id="register-name" type="text" className="authflow-field__input" placeholder="Jane Doe" value={form.name} onChange={update('name')} autoComplete="name" disabled={isSubmitting} /></div>
      <div className="authflow-field"><label htmlFor="register-email" className="authflow-field__label">Email Address</label><input id="register-email" type="email" className="authflow-field__input" placeholder="you@example.com" value={form.email} onChange={update('email')} autoComplete="email" disabled={isSubmitting} /></div>
      <div className="authflow-field"><label htmlFor="register-password" className="authflow-field__label">Password</label><div className="authflow-field__input-wrapper"><input id="register-password" type={visible.password ? 'text' : 'password'} className="authflow-field__input" placeholder="At least 6 characters" value={form.password} onChange={update('password')} autoComplete="new-password" disabled={isSubmitting} /><button type="button" className="authflow-field__toggle" onClick={() => setVisible((state) => ({ ...state, password: !state.password }))} aria-label={visible.password ? 'Hide password' : 'Show password'}><EyeIcon hidden={visible.password} /></button></div></div>
      <div className="authflow-field"><label htmlFor="register-confirm" className="authflow-field__label">Confirm Password</label><div className="authflow-field__input-wrapper"><input id="register-confirm" type={visible.confirm ? 'text' : 'password'} className="authflow-field__input" placeholder="Repeat your password" value={form.confirmPassword} onChange={update('confirmPassword')} autoComplete="new-password" disabled={isSubmitting} /><button type="button" className="authflow-field__toggle" onClick={() => setVisible((state) => ({ ...state, confirm: !state.confirm }))} aria-label={visible.confirm ? 'Hide password' : 'Show password'}><EyeIcon hidden={visible.confirm} /></button></div></div>
      <button type="submit" className="authflow-btn authflow-btn--primary" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create Account'}</button>
      <div className="authflow-switch">Already have an account? <button type="button" onClick={onSwitchToLogin} disabled={isSubmitting}>Sign in</button></div>
    </form>
  )
}