import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const ok = login(form.email, form.password)
    setLoading(false)
    if (ok) navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-xl font-bold text-gray-800"></div>
        </div>

        {/* Card */}
        <div className="card p-8">
          <div className='flex justify-center'>
            <h2 className="text-l font-semibold text-gray-800 mb-6">Masuk sebagai Admin</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@cimbniaga.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  onClick={() => setShowPass((s) => !s)}
                >
                  {showPass ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-xs">
                ⚠ {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-red w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Hint for demo */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">Demo credentials</p>
            <div className="mt-1 bg-gray-50 rounded-lg p-2.5 text-xs font-mono text-gray-500 space-y-0.5">
              <div>email: admin@cimbniaga.com</div>
              <div>pass: 12345</div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Bukan admin?{' '}
          <a href="/laporan" className="text-cimb-red hover:underline">
            Laporan nasabah →
          </a>
        </p>
      </div>
    </div>
  )
}
