import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTickets } from '../../context/TicketContext'
import { simulateLLMAnalysis } from '../../data/dummyData'
import Navbar from '../../components/Navbar'

const KATEGORI_OPTIONS = [
  'Halaman login palsu',
  'SMS/WA spoofing',
  'Link promo palsu',
  'Social engineering',
  'Email phishing',
  'Lainnya',
]

const STEPS = ['Isi Detail', 'Analisis AI', 'Selesai']

export default function LaporanPage() {
  const navigate = useNavigate()
  const { addTicket } = useTickets()

  const [step, setStep] = useState(0) // 0: form, 1: analyzing, 2: result
  const [form, setForm] = useState({
    url: '',
    kategori: '',
    kronologi: '',
    bukti: null,
    pelapor: '',
  })
  const [errors, setErrors] = useState({})
  const [analisisResult, setAnalisisResult] = useState(null)
  const [ticketId, setTicketId] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.url.trim()) e.url = 'URL wajib diisi'
    if (!form.kategori) e.kategori = 'Pilih kategori modus'
    if (!form.kronologi.trim() || form.kronologi.length < 20)
      e.kronologi = 'Kronologi minimal 20 karakter'
    if (!form.pelapor.trim()) e.pelapor = 'Nama pelapor wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setStep(1) // analyzing

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const response = await fetch(`${apiUrl}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_message: `URL: ${form.url}\nKategori: ${form.kategori}\nKronologi: ${form.kronologi}\nPelapor: ${form.pelapor}`,
        }),
      })
      const analisis = await response.json()

      const id = addTicket({
        url: form.url,
        kategori: form.kategori,
        kronologi: form.kronologi,
        bukti: form.bukti ? form.bukti.name : null,
        pelapor: form.pelapor,
        riskScore: analisis.risk_score,
        analisis,
        ticketId: analisis.ticket_id,
      })

      setAnalisisResult(analisis)
      setTicketId(analisis.ticket_id)
      setStep(2)
    } catch (error) {
      console.error('API Error:', error)
      setStep(0)
      setErrors({ submit: 'Gagal menghubungi server. Pastikan backend running.' })
    }
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero strip */}
      <div className="bg-cimb-red text-white py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold">Laporkan Phishing & Fraud</h1>
          <p className="text-red-100 text-sm mt-1">
            Bantu kami melindungi sesama nasabah dengan melaporkan tautan atau akun mencurigakan.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i < step
                        ? 'bg-green-500 text-white'
                        : i === step
                        ? 'bg-cimb-red text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      i === step ? 'text-cimb-red' : i < step ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 mx-3 h-px ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* STEP 0: FORM */}
        {step === 0 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">
                Informasi Pelapor
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  className={`input-field ${errors.pelapor ? 'border-red-400' : ''}`}
                  placeholder="Nama Anda"
                  value={form.pelapor}
                  onChange={handleChange('pelapor')}
                />
                {errors.pelapor && <p className="text-red-500 text-xs mt-1">{errors.pelapor}</p>}
              </div>
            </div>

            <div className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">
                Detail Laporan
              </h2>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  URL / Link mencurigakan <span className="text-red-500">*</span>
                </label>
                <input
                  className={`input-field font-mono text-xs ${errors.url ? 'border-red-400' : ''}`}
                  placeholder="https://contoh-phishing.xyz/login"
                  value={form.url}
                  onChange={handleChange('url')}
                />
                {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  URL akan dianalisis otomatis oleh sistem AI kami setelah dikirim.
                </p>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kategori modus <span className="text-red-500">*</span>
                </label>
                <select
                  className={`input-field bg-white ${errors.kategori ? 'border-red-400' : ''}`}
                  value={form.kategori}
                  onChange={handleChange('kategori')}
                >
                  <option value="">-- Pilih kategori --</option>
                  {KATEGORI_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                {errors.kategori && <p className="text-red-500 text-xs mt-1">{errors.kategori}</p>}
              </div>

              {/* Kronologi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kronologi kejadian <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className={`input-field resize-none ${errors.kronologi ? 'border-red-400' : ''}`}
                  placeholder="Ceritakan bagaimana Anda menemukan atau menerima link ini, apa yang terjadi, dan dampaknya..."
                  value={form.kronologi}
                  onChange={handleChange('kronologi')}
                />
                <div className="flex justify-between mt-1">
                  {errors.kronologi ? (
                    <p className="text-red-500 text-xs">{errors.kronologi}</p>
                  ) : (
                    <span />
                  )}
                  <span className={`text-xs ${form.kronologi.length < 20 ? 'text-gray-400' : 'text-green-600'}`}>
                    {form.kronologi.length} karakter
                  </span>
                </div>
              </div>

              {/* Upload bukti */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bukti (opsional)
                </label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg px-4 py-6 text-center cursor-pointer hover:border-cimb-red hover:bg-red-50/30 transition-colors"
                  onClick={() => document.getElementById('file-input').click()}
                >
                  {form.bukti ? (
                    <div className="text-sm text-gray-700">
                      <span className="text-green-600 font-medium">✓ {form.bukti.name}</span>
                      <button
                        type="button"
                        className="ml-3 text-xs text-red-500 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setForm((prev) => ({ ...prev, bukti: null }))
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl mb-1">📎</div>
                      <p className="text-sm text-gray-500">
                        Klik untuk unggah screenshot atau file bukti
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF — maks 10 MB</p>
                    </>
                  )}
                </div>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={(e) => setForm((prev) => ({ ...prev, bukti: e.target.files[0] || null }))}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setForm({ url: '', kategori: '', kronologi: '', bukti: null, pelapor: '' })}
                className="btn-outline text-sm"
              >
                Reset
              </button>
              <button type="submit" className="btn-red text-sm">
                Kirim & Analisis →
              </button>
            </div>
          </form>
        )}

        {/* STEP 1: ANALYZING */}
        {step === 1 && (
          <div className="card p-10 text-center">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-cimb-red border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Sedang dianalisis...</h2>
            <p className="text-sm text-gray-500 mb-4">
              AI kami sedang memeriksa URL dan data laporan Anda.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
              {['Memeriksa reputasi domain...', 'Menganalisis pola URL...', 'Mencocokkan dengan database phishing...'].map(
                (msg, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-cimb-red animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    {msg}
                  </div>
                )
              )}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              {/* TODO: Replace dengan real LLM endpoint saat integrasi backend */}
              Menggunakan model analisis phishing CIMB PhishGuard v1.0
            </p>
          </div>
        )}

        {/* STEP 2: RESULT */}
        {step === 2 && analisisResult && (
          <div className="space-y-5">
            {/* Success banner */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">✓</div>
              <div>
                <div className="font-semibold text-green-800 text-sm">Laporan berhasil dikirim!</div>
                <div className="text-green-700 text-xs">
                  Tiket{' '}
                  <span className="font-mono font-bold">#{ticketId}</span> telah dibuat. Tim kami akan merespons dalam &lt; 4 jam.
                </div>
              </div>
            </div>

            {/* Hasil analisis */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-base">🤖</span> Hasil Analisis AI
              </h3>

              {/* Score */}
              <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 rounded-xl">
                <div
                  className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center font-bold flex-shrink-0 ${
                    analisisResult.riskScore >= 70
                      ? 'border-red-400 bg-red-50 text-red-700'
                      : 'border-amber-400 bg-amber-50 text-amber-700'
                  }`}
                >
                  <span className="text-xl leading-none">{analisisResult.riskScore}</span>
                  <span className="text-[9px] font-normal leading-none mt-0.5">/ 100</span>
                </div>
                <div>
                  <div
                    className={`text-base font-bold ${
                      analisisResult.riskScore >= 70 ? 'text-red-700' : 'text-amber-700'
                    }`}
                  >
                    {analisisResult.klasifikasi}
                  </div>
                  <div className="text-xs text-gray-500">
                    Skor risiko:{' '}
                    <span className="font-semibold">
                      {analisisResult.riskScore >= 70
                        ? 'Tinggi — tindakan segera diperlukan'
                        : 'Sedang — perlu verifikasi lebih lanjut'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Findings */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-600 mb-2">Temuan Analisis:</div>
                <ul className="space-y-1.5">
                  {analisisResult?.keyFindings?.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
                      {f}
                    </li>
                  )) || <li className="text-xs text-gray-600">Analisis selesai</li>}
                </ul>
              </div>

              {/* Rekomendasi */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <div className="text-xs font-semibold text-blue-700 mb-1">Tindak lanjut:</div>
                <div className="text-xs text-blue-600">{analisisResult.rekomendasi}</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                className="btn-outline text-sm flex-1"
                onClick={() => {
                  setStep(0)
                  setForm({ url: '', kategori: '', kronologi: '', bukti: null, pelapor: '' })
                  setAnalisisResult(null)
                  setTicketId(null)
                }}
              >
                Lapor lagi
              </button>
              <button
                className="btn-red text-sm flex-1"
                onClick={() => navigate('/edukasi')}
              >
                Lihat Tips Keamanan →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
