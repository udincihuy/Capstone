import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { RiskBadge, StatusBadge, ScoreRing } from '../../components/Badges'
import { useTickets } from '../../context/TicketContext'

const STATUS_TABS = ['Semua', 'Open', 'Investigasi', 'Closed']

export default function TicketingPage() {
  const navigate = useNavigate()
  const { tickets } = useTickets()
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [risikoFilter, setRisikoFilter] = useState('Semua')
  const [search, setSearch] = useState('')

  const filtered = tickets.filter((t) => {
    const matchStatus = statusFilter === 'Semua' || t.status === statusFilter
    const matchRisiko =
      risikoFilter === 'Semua' ||
      (risikoFilter === 'Tinggi' && t.riskScore >= 70) ||
      (risikoFilter === 'Sedang' && t.riskScore >= 40 && t.riskScore < 70) ||
      (risikoFilter === 'Rendah' && t.riskScore < 40)
    const matchSearch =
      !search ||
      t.url.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.pelapor?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchRisiko && matchSearch
  })

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const counts = {
    Semua: tickets.length,
    Open: tickets.filter((t) => t.status === 'Open').length,
    Investigasi: tickets.filter((t) => t.status === 'Investigasi').length,
    Closed: tickets.filter((t) => t.status === 'Closed').length,
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-lg font-bold text-gray-800">Manajemen Tiket</h1>
          <p className="text-sm text-gray-500">Semua laporan phishing yang masuk dari nasabah</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Search & filter */}
          <div className="card p-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Cari tiket, URL, atau nama pelapor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="input-field sm:w-40 bg-white"
              value={risikoFilter}
              onChange={(e) => setRisikoFilter(e.target.value)}
            >
              <option value="Semua">Semua Risiko</option>
              <option value="Tinggi">Risiko Tinggi</option>
              <option value="Sedang">Risiko Sedang</option>
              <option value="Rendah">Risiko Rendah</option>
            </select>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 w-fit">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === tab
                    ? 'bg-cimb-red text-white'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab}
                <span className={`ml-1.5 text-xs ${statusFilter === tab ? 'text-red-200' : 'text-gray-400'}`}>
                  {counts[tab] || filtered.length}
                </span>
              </button>
            ))}
          </div>

          {/* Ticket list */}
          <div className="card divide-y divide-gray-50">
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">
                Tidak ada tiket ditemukan.
              </div>
            )}
            {filtered.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/admin/ticketing/${t.id}`)}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <ScoreRing score={t.riskScore} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-gray-400">{t.id}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="text-sm font-medium text-gray-800 truncate">{t.url}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {t.kategori} · {t.pelapor} · {formatDate(t.tanggal)}
                  </div>
                </div>
                <RiskBadge score={t.riskScore} />
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">›</span>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-400 text-right">
            Menampilkan {filtered.length} dari {tickets.length} tiket
          </div>
        </div>
      </main>
    </div>
  )
}
