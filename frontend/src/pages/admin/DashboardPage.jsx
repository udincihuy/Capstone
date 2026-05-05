import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import AdminSidebar from '../../components/AdminSidebar'
import { RiskBadge, StatusBadge } from '../../components/Badges'
import { useTickets } from '../../context/TicketContext'
import { WEEKLY_TREND, MODUS_DATA } from '../../data/dummyData'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-md text-xs">
      <div className="font-semibold text-gray-700 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { tickets, stats } = useTickets()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
        const response = await fetch(`${apiUrl}/api/admin/submissions`, {
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()
        setSubmissions(data.submissions || [])
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [])

  const recent = submissions.slice(0, 5)

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-lg font-bold text-gray-800">Dashboard Monitoring</h1>
          <p className="text-sm text-gray-500">Overview insiden phishing & fraud real-time</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Laporan', value: stats.total, sub: 'Semua waktu', color: 'text-gray-800' },
              { label: 'Risiko Tinggi', value: stats.risikoTinggi, sub: 'Skor ≥ 70', color: 'text-red-600' },
              { label: 'Open', value: stats.open, sub: 'Belum ditangani', color: 'text-blue-600' },
              { label: 'Investigasi', value: stats.investigasi, sub: 'Sedang diproses', color: 'text-amber-600' },
            ].map((m) => (
              <div key={m.label} className="card p-4">
                <div className="text-xs text-gray-500 mb-1">{m.label}</div>
                <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Bar chart tren */}
            <div className="card p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Tren Laporan 7 Hari Terakhir</h3>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={WEEKLY_TREND} barSize={18} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hari" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="laporan" name="Total Laporan" fill="#C1272D" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="risiko_tinggi" name="Risiko Tinggi" fill="#fca5a5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Modus distribusi */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribusi Modus</h3>
              <div className="space-y-3">
                {MODUS_DATA.map((m) => (
                  <div key={m.name}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{m.name}</span>
                      <span className="font-semibold">{m.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cimb-red rounded-full transition-all"
                        style={{ width: `${m.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent tickets */}
          <div className="card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Tiket Terbaru</h3>
              <button
                onClick={() => navigate('/admin/ticketing')}
                className="text-xs text-cimb-red hover:underline"
              >
                Lihat semua →
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {recent.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/admin/ticketing/${t.id}`)}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="text-xs font-mono text-gray-400 w-16 flex-shrink-0">{t.id}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{t.url}</div>
                    <div className="text-xs text-gray-400">{t.kategori} · {formatDate(t.tanggal)}</div>
                  </div>
                  <RiskBadge score={t.riskScore} />
                  <StatusBadge status={t.status} />
                  <span className="text-gray-300 text-sm">›</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 border-l-4 border-l-red-500">
              <div className="text-xs text-gray-500 mb-1">Akurasi Model ML</div>
              <div className="text-2xl font-bold text-gray-800">87%</div>
              <div className="text-xs text-gray-400">Target minimum 70% ✓</div>
            </div>
            <div className="card p-4 border-l-4 border-l-blue-500">
              <div className="text-xs text-gray-500 mb-1">Avg. Response Time</div>
              <div className="text-2xl font-bold text-gray-800">2.1<span className="text-sm font-normal"> jam</span></div>
              <div className="text-xs text-gray-400">Target &lt; 4 jam ✓</div>
            </div>
            <div className="card p-4 border-l-4 border-l-green-500">
              <div className="text-xs text-gray-500 mb-1">Tiket Closed Minggu Ini</div>
              <div className="text-2xl font-bold text-gray-800">{stats.closed}</div>
              <div className="text-xs text-gray-400">Dari {stats.total} total laporan</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
