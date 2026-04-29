import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, setAuthToken } from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
      const res = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      })
      setAuthToken(res.data.token)
      navigate('/explore')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Create Account</h1>
        <p className="muted">Register to add interview experiences to the vault.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Your name"
            required
            minLength={2}
          />

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
            placeholder="At least 8 chars, include number"
            required
            minLength={8}
          />

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary full" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" className="gold">Login</Link>
        </p>
      </section>
    </main>
  )
}
