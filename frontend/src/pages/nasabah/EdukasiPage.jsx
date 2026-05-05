import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { TIPS_EDUKASI } from '../../data/dummyData'

const COLOR_MAP = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-100', tag: 'bg-blue-100 text-blue-700', icon: 'bg-blue-100' },
  red: { bg: 'bg-red-50', border: 'border-red-100', tag: 'bg-red-100 text-red-700', icon: 'bg-red-100' },
  yellow: { bg: 'bg-amber-50', border: 'border-amber-100', tag: 'bg-amber-100 text-amber-700', icon: 'bg-amber-100' },
  green: { bg: 'bg-green-50', border: 'border-green-100', tag: 'bg-green-100 text-green-700', icon: 'bg-green-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-100', tag: 'bg-purple-100 text-purple-700', icon: 'bg-purple-100' },
}

const QUIZ = [
  {
    soal: 'Kamu menerima SMS dari "CIMB Niaga" yang meminta kamu login melalui link bit.ly/cimb-promo. Apa yang harus kamu lakukan?',
    pilihan: [
      'Klik link dan login seperti biasa',
      'Abaikan dan hapus SMS tersebut, laporkan ke PhishGuard',
      'Balas SMS dan tanya apakah ini resmi',
      'Forward ke teman-teman sebagai peringatan',
    ],
    jawaban: 1,
    penjelasan: 'Link yang dipersingkat (bit.ly) dari bank adalah tanda bahaya. Bank resmi tidak pernah mengirim link login melalui SMS. Selalu akses via aplikasi OCTO atau browser langsung ke cimbniaga.co.id.',
  },
  {
    soal: 'Seseorang menelepon mengaku sebagai CS CIMB Niaga dan meminta kode OTP yang baru saja dikirim ke HPmu. Apa responsmu?',
    pilihan: [
      'Berikan kode OTP karena mereka mengaku CS resmi',
      'Minta mereka menunggu, cek dulu di aplikasi OCTO',
      'Tutup telepon, jangan berikan OTP kepada siapapun',
      'Berikan OTP asalkan mereka bisa menyebut nama lengkapmu',
    ],
    jawaban: 2,
    penjelasan: 'OTP bersifat rahasia dan tidak boleh diberikan kepada siapapun — termasuk yang mengaku sebagai CS bank. Bank tidak pernah meminta OTP melalui telepon.',
  },
  {
    soal: 'Domain mana yang merupakan website resmi CIMB Niaga?',
    pilihan: [
      'secure-cimb-update.com',
      'cimbniaga.web.id',
      'cimbniaga.co.id',
      'cimb-niaga-verify.net',
    ],
    jawaban: 2,
    penjelasan: 'Domain resmi CIMB Niaga adalah cimbniaga.co.id. Semua varian lain yang mirip adalah potensi phishing.',
  },
]

export default function EdukasiPage() {
  const [quizActive, setQuizActive] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === QUIZ[quizStep].jawaban) setScore((s) => s + 1)
  }

  const nextQuestion = () => {
    if (quizStep < QUIZ.length - 1) {
      setQuizStep((s) => s + 1)
      setSelected(null)
    } else {
      setQuizDone(true)
    }
  }

  const resetQuiz = () => {
    setQuizStep(0)
    setSelected(null)
    setScore(0)
    setQuizDone(false)
    setQuizActive(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-cimb-red to-cimb-dark text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-3">🛡️</div>
          <h1 className="text-2xl font-bold mb-2">Edukasi Keamanan Digital</h1>
          <p className="text-red-100 text-sm max-w-lg mx-auto">
            Pelajari cara melindungi diri dari phishing dan fraud perbankan digital. Pengetahuan adalah pertahanan terbaik.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* Tips cards */}
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-4">📌 Tips Perlindungan</h2>
          <div className="grid grid-cols-1 gap-4">
            {TIPS_EDUKASI.map((tip, i) => {
              const c = COLOR_MAP[tip.color]
              return (
                <div key={i} className={`card p-5 border ${c.border} ${c.bg}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center text-xl flex-shrink-0`}>
                      {tip.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-semibold text-sm text-gray-800">{tip.judul}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.tag}`}>
                          {tip.tag}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{tip.deskripsi}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Ciri-ciri phishing */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">🚨 Ciri-Ciri Phishing yang Wajib Dikenali</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['URL menggunakan domain aneh', 'Bukan cimbniaga.co.id'],
              ['Meminta OTP / PIN via pesan', 'Bank resmi tidak pernah melakukan ini'],
              ['Penawaran terlalu menggiurkan', '"Hadiah 500rb, klaim sekarang!"'],
              ['Desain mirip tapi ada yang beda', 'Logo sedikit berbeda, typo, dll'],
              ['Link dipersingkat (bit.ly, tinyurl)', 'Menyembunyikan tujuan asli'],
              ['Pesan membuat panik / urgency', '"Akun Anda akan diblokir!"'],
            ].map(([title, sub], i) => (
              <div key={i} className="flex items-start gap-2 bg-red-50 rounded-lg p-3">
                <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
                <div>
                  <div className="text-sm font-medium text-red-800">{title}</div>
                  <div className="text-xs text-red-600">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz section */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-gray-800 mb-1">🎯 Uji Pemahamanmu</h2>
          <p className="text-sm text-gray-500 mb-4">
            Simulasi 3 skenario nyata yang sering dialami nasabah CIMB Niaga.
          </p>

          {!quizActive && !quizDone && (
            <button className="btn-red text-sm" onClick={() => setQuizActive(true)}>
              Mulai Quiz →
            </button>
          )}

          {quizActive && !quizDone && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-400">Soal {quizStep + 1} dari {QUIZ.length}</span>
                <div className="flex gap-1">
                  {QUIZ.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= quizStep ? 'bg-cimb-red' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-gray-800">{QUIZ[quizStep].soal}</p>
              </div>

              <div className="space-y-2 mb-4">
                {QUIZ[quizStep].pilihan.map((p, i) => {
                  let cls = 'border border-gray-200 bg-white hover:border-cimb-red hover:bg-red-50/30'
                  if (selected !== null) {
                    if (i === QUIZ[quizStep].jawaban) cls = 'border-2 border-green-500 bg-green-50'
                    else if (i === selected && selected !== QUIZ[quizStep].jawaban)
                      cls = 'border-2 border-red-400 bg-red-50'
                    else cls = 'border border-gray-200 bg-white opacity-50'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left rounded-xl px-4 py-3 text-sm transition-all ${cls}`}
                    >
                      <span className="font-medium text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                      {p}
                    </button>
                  )
                })}
              </div>

              {selected !== null && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                  <div className="text-xs font-semibold text-blue-700 mb-1">
                    {selected === QUIZ[quizStep].jawaban ? '✅ Benar!' : '❌ Kurang tepat.'}
                  </div>
                  <p className="text-xs text-blue-600">{QUIZ[quizStep].penjelasan}</p>
                </div>
              )}

              {selected !== null && (
                <button className="btn-red text-sm" onClick={nextQuestion}>
                  {quizStep < QUIZ.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil →'}
                </button>
              )}
            </div>
          )}

          {quizDone && (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">
                {score === QUIZ.length ? '🏆' : score >= 2 ? '👍' : '📚'}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {score} / {QUIZ.length} Benar
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {score === QUIZ.length
                  ? 'Sempurna! Kamu sudah paham cara menghadapi phishing.'
                  : score >= 2
                  ? 'Bagus! Tapi ada beberapa hal yang perlu dipelajari lagi.'
                  : 'Masih perlu banyak belajar. Baca lagi tips di atas ya!'}
              </p>
              <div className="flex gap-3 justify-center">
                <button className="btn-outline text-sm" onClick={resetQuiz}>Ulangi Quiz</button>
                <Link to="/laporan" className="btn-red text-sm inline-block">
                  Laporkan Phishing →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Kontak darurat */}
        <div className="bg-gray-900 text-white rounded-2xl p-6">
          <h3 className="font-bold mb-3">📞 Butuh bantuan segera?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-0.5">CIMB Niaga Call Center</div>
              <div className="font-bold text-lg">14041</div>
              <div className="text-xs text-gray-400">24/7, gratis dari semua operator</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-0.5">WhatsApp Resmi OCTO</div>
              <div className="font-bold text-lg">+62 812-9333-1049</div>
              <div className="text-xs text-gray-400">Verifikasi via centang biru WA</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
