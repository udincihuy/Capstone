import { useParams, useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { RiskBadge, StatusBadge, ScoreRing } from '../../components/Badges'
import { useTickets } from '../../context/TicketContext'

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTicketById } = useTickets()
  const ticket = getTicketById(id)

  if (!ticket) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-lg font-semibold text-gray-700">Tiket tidak ditemukan</h2>
            <button className="btn-red mt-4 text-sm" onClick={() => navigate('/admin/ticketing')}>
              Kembali ke Ticketing
            </button>
          </div>
        </main>
      </div>
    )
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const klasifikasiColor = {
    Phishing: 'bg-red-50 border-red-200 text-red-700',
    Mencurigakan: 'bg-amber-50 border-amber-200 text-amber-700',
    'Tidak Berbahaya': 'bg-green-50 border-green-200 text-green-700',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/ticketing')}
            className="text-gray-400 hover:text-gray-700 transition-colors text-sm"
          >
            ← Kembali
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-gray-800 font-mono">#{ticket.id}</span>
              <StatusBadge status={ticket.status} />
              <RiskBadge score={ticket.riskScore} />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(ticket.tanggal)}</p>
          </div>
        </div>

        <div className="p-6 space-y-5 max-w-3xl">
          {/* Risk score hero */}
          <div className={`card p-5 flex items-center gap-5 border-2 ${ticket.riskScore >= 70 ? 'border-red-200 bg-red-50/40' : ticket.riskScore >= 40 ? 'border-amber-200 bg-amber-50/40' : 'border-green-200 bg-green-50/40'}`}>
            <ScoreRing score={ticket.riskScore} />
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Skor Risiko</div>
              <div className={`text-xl font-bold ${ticket.riskScore >= 70 ? 'text-red-700' : ticket.riskScore >= 40 ? 'text-amber-700' : 'text-green-700'}`}>
                {ticket.riskScore >= 70 ? 'Tinggi' : ticket.riskScore >= 40 ? 'Sedang' : 'Rendah'} — {ticket.riskScore}/100
              </div>
              <div className="text-sm text-gray-600 mt-0.5">
                URL: <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border">{ticket.url}</span>
              </div>
            </div>
          </div>

          {/* Grid info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Laporan detail */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                📋 Detail Laporan
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Pelapor</dt>
                  <dd className="text-sm font-medium text-gray-800">{ticket.pelapor || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Kategori Modus</dt>
                  <dd className="text-sm font-medium text-gray-800">{ticket.kategori}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Status</dt>
                  <dd><StatusBadge status={ticket.status} /></dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Bukti Dilampirkan</dt>
                  <dd className="text-sm text-gray-800">
                    {ticket.bukti ? (
                      <span className="text-blue-600 text-xs font-mono bg-blue-50 px-2 py-0.5 rounded">
                        📎 {ticket.bukti}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Tidak ada</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Tanggal Laporan</dt>
                  <dd className="text-xs text-gray-700">{formatDate(ticket.tanggal)}</dd>
                </div>
              </dl>
            </div>

            {/* AI Analysis */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                🤖 Hasil Analisis AI
              </h3>
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Klasifikasi</div>
                <span className={`inline-block text-sm font-bold px-3 py-1 rounded-lg border ${klasifikasiColor[ticket.analisis?.klasifikasi] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  {ticket.analisis?.klasifikasi || '—'}
                </span>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Temuan Utama</div>
                <ul className="space-y-1.5">
                  {(ticket.analisis?.keyFindings || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Kronologi */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">💬 Kronologi dari Pelapor</h3>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 italic">
              "{ticket.kronologi}"
            </p>
          </div>

          {/* Rekomendasi */}
          {ticket.analisis?.rekomendasi && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">📌 Rekomendasi Tindak Lanjut</h3>
              <p className="text-sm text-blue-700">{ticket.analisis.rekomendasi}</p>
            </div>
          )}

          {/* Info read only */}
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">
              Admin panel bersifat <strong>read-only monitoring</strong>. Untuk tindakan lebih lanjut, koordinasikan dengan tim teknis sesuai SOP.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
