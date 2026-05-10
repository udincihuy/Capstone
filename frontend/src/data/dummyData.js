// ─────────────────────────────────────────────────────────────────────────────
// WHITELIST DATA - Reference untuk UI dan testing
// ─────────────────────────────────────────────────────────────────────────────

export const WHITELIST_URLS = [
  'cimbniaga.co.id', 'octo.id', 'cimbniaga.com', 'octo.cimbniaga.co.id',
]

export const WHITELIST_PHONES = [
  '14041', '1500800', '+6214041', '021-14041',
]

export const WHITELIST_EMAILS = [
  'cs@cimbniaga.co.id', 'info@cimbniaga.co.id', 'noreply@cimbniaga.co.id',
]

// ℹ️ Tickets data sekarang di-fetch dari backend API /admin/submissions
// Tidak ada lagi dummy data statis. Semua data real dari database!

export const WEEKLY_TREND = [
  { hari: 'Sen', laporan: 23, risiko_tinggi: 9 },
  { hari: 'Sel', laporan: 17, risiko_tinggi: 5 },
  { hari: 'Rab', laporan: 34, risiko_tinggi: 14 },
  { hari: 'Kam', laporan: 25, risiko_tinggi: 8 },
  { hari: 'Jum', laporan: 38, risiko_tinggi: 16 },
  { hari: 'Sab', laporan: 15, risiko_tinggi: 4 },
  { hari: 'Min', laporan: 9,  risiko_tinggi: 2 },
]

export const MODUS_DATA = [
  { name: 'SMS phishing', value: 38 },
  { name: 'WhatsApp fraud', value: 29 },
  { name: 'Email spoofing', value: 20 },
  { name: 'URL langsung', value: 13 },
]

export const TIPS_EDUKASI = [
  { icon: '🔗', judul: 'Periksa URL dengan teliti', deskripsi: 'CIMB Niaga hanya menggunakan domain resmi cimbniaga.co.id. Waspada terhadap variasi seperti cimb-niaga[.]xyz atau domain yang menambahkan kata "verify", "update", atau "promo".', tag: 'URL & Domain', color: 'blue' },
  { icon: '🔐', judul: 'Jangan pernah bagikan OTP', deskripsi: 'Bank tidak pernah meminta kode OTP melalui telepon, SMS, atau chat — termasuk yang mengaku petugas CIMB Niaga. OTP hanya untuk konfirmasi transaksi yang kamu lakukan sendiri.', tag: 'OTP & Password', color: 'red' },
  { icon: '📧', judul: 'Verifikasi email pengirim', deskripsi: 'Email resmi CIMB Niaga selalu berakhiran @cimbniaga.co.id. Waspadai email dari domain yang mirip tapi berbeda, seperti @cimb-niaga.com atau @cimbniaga.net.', tag: 'Email', color: 'yellow' },
  { icon: '📱', judul: 'Gunakan aplikasi OCTO resmi', deskripsi: 'Unduh aplikasi OCTO by CIMB Niaga hanya dari Google Play Store atau App Store resmi. Jangan pernah menginstal APK dari link di SMS atau WhatsApp.', tag: 'Aplikasi', color: 'green' },
  { icon: '⚡', judul: 'Laporkan segera jika ada yang mencurigakan', deskripsi: 'Semakin cepat laporan masuk, semakin cepat tim kami dapat memblokir ancaman dan melindungi nasabah lain. Hubungi 14041 atau gunakan platform ini.', tag: 'Tindakan Cepat', color: 'purple' },
]

// ─────────────────────────────────────────────────────────────────────────────
// SIMULASI ANALISIS — Ganti dengan API call ke backend saat integrasi
//
// TODO: Replace dengan:
//   const res = await fetch('/api/analyze', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ jenis, pesan }),
//   })
//   return await res.json()
// ─────────────────────────────────────────────────────────────────────────────
export const simulateAnalysis = (jenis, pesan) => {
  return new Promise((resolve) => {
    // Step 1: Ekstraksi (800ms)
    // Step 2: Whitelist check (800ms)
    // Step 3: NLP (900ms)
    // Total ~2.5s

    // Regex ekstraksi — sama persis dengan yang akan dipakai backend
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?)/gi
    const phoneRegex = /(?:\+62|0)[\d\-\s]{8,14}/g
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

    const rawUrls    = [...new Set((pesan.match(urlRegex) || []).map(u => u.replace(/^https?:\/\//i,'')))]
    const rawPhones  = [...new Set(pesan.match(phoneRegex) || [])]
    const rawEmails  = [...new Set(pesan.match(emailRegex) || [])]

    // Whitelist check
    const isUrlClean    = rawUrls.every(u   => WHITELIST_URLS.some(w    => u.startsWith(w)))
    const isPhoneClean  = rawPhones.every(p => WHITELIST_PHONES.some(w  => p.includes(w)))
    const isEmailClean  = rawEmails.every(e => WHITELIST_EMAILS.includes(e.toLowerCase()))
    const hasExtracted  = rawUrls.length > 0 || rawPhones.length > 0 || rawEmails.length > 0

    const whitelistScore = (hasExtracted && (!isUrlClean || !isPhoneClean || !isEmailClean)) ? 80 : 0

    // NLP score simulasi — nanti diganti hasil IndoBERT finetuned
    const manipulatifKeywords = ['segera','cepat','darurat','diblokir','terblokir','kadaluarsa','menang','hadiah','gratis','cashback','verifikasi','konfirmasi','transfer','klik','tekan','daftar','klaim']
    const keywordHits = manipulatifKeywords.filter(k => pesan.toLowerCase().includes(k)).length
    const nlpScore = hasExtracted
      ? Math.min(20, keywordHits * 5)
      : Math.min(100, keywordHits * 25)

    const riskScore    = Math.min(100, whitelistScore + nlpScore)
    const breakdownType = hasExtracted ? 'combined' : 'nlp_only'

    // Tentukan klasifikasi
    let klasifikasi
    if (riskScore >= 70) klasifikasi = 'Phishing'
    else if (riskScore >= 40) klasifikasi = 'Mencurigakan'
    else klasifikasi = 'Aman'

    // Temuan
    const findings = []
    if (rawUrls.length > 0 && !isUrlClean)    findings.push(`URL "${rawUrls[0]}" tidak terdaftar di whitelist resmi CIMB Niaga`)
    if (rawPhones.length > 0 && !isPhoneClean) findings.push(`Nomor "${rawPhones[0]}" bukan nomor resmi CIMB Niaga`)
    if (rawEmails.length > 0 && !isEmailClean) findings.push(`Email pengirim "${rawEmails[0]}" bukan domain resmi CIMB Niaga`)
    if (nlpScore > 0) findings.push('Teks mengandung pola manipulatif: urgensi/iming-iming terdeteksi oleh model NLP')
    if (findings.length === 0) findings.push('Tidak ditemukan komponen mencurigakan')

    setTimeout(() => {
      resolve({
        extractedUrls:   rawUrls,
        extractedPhones: rawPhones,
        extractedEmails: rawEmails,
        whitelistScore,
        nlpScore,
        riskScore,
        breakdownType,
        klasifikasi,
        findings,
      })
    }, 2600)
  })
}
