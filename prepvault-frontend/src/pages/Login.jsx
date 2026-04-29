import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, setAuthToken } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser({
        email: form.email.trim(),
        password: form.password
      })
      setAuthToken(res.data.token)
      navigate('/explore')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Login</h1>
        <p className="muted">Use your PrepVault account to submit experiences.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="At least 8 chars"
            required
            minLength={8}
          />

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          No account? <Link to="/register" className="gold">Create one</Link>
        </p>
      </section>
    </main>
  )
}
