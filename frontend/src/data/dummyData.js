export const DUMMY_TICKETS = [
  {
    id: 'T-0047',
    url: 'cimb-promo[.]xyz/login',
    kategori: 'Halaman login palsu',
    kronologi: 'Saya menerima SMS mengatasnamakan CIMB Niaga yang meminta klik link untuk verifikasi akun. Setelah diklik, muncul halaman login yang mirip sekali dengan OCTO by CIMB.',
    bukti: 'screenshot_sms.jpg',
    riskScore: 91,
    status: 'Open',
    pelapor: 'Budi Santoso',
    tanggal: '2026-04-01T08:23:00',
    analisis: {
      klasifikasi: 'Phishing',
      keyFindings: [
        'Domain tidak menggunakan TLD resmi (.co.id)',
        'SSL sertifikat baru dibuat < 7 hari lalu',
        'Pola URL meniru domain resmi CIMB Niaga',
        'Halaman meminta kredensial lengkap termasuk PIN',
      ],
      rekomendasi: 'Blokir domain segera. Informasikan ke seluruh nasabah via notifikasi push.',
    },
  },
  {
    id: 'T-0046',
    url: 'bit.ly/cimb-hadiah-2024',
    kategori: 'SMS/WA spoofing',
    kronologi: 'WA dari nomor tidak dikenal mengatasnamakan CIMB Niaga menawarkan hadiah cashback Rp 500.000, meminta klik link dan isi data rekening.',
    bukti: 'screenshot_wa.jpg',
    riskScore: 88,
    status: 'Investigasi',
    pelapor: 'Siti Rahayu',
    tanggal: '2026-04-01T07:45:00',
    analisis: {
      klasifikasi: 'Phishing',
      keyFindings: [
        'URL dipersingkat menggunakan bit.ly (menyembunyikan tujuan asli)',
        'Konten pesan memiliki pola urgency ("Segera klaim!")',
        'Nomor pengirim bukan nomor resmi CIMB Niaga',
        'Halaman tujuan meminta data sensitif perbankan',
      ],
      rekomendasi: 'Koordinasi dengan Bitly untuk takedown link. Tandai nomor sebagai spam.',
    },
  },
  {
    id: 'T-0045',
    url: 'tinyurl.com/cimb-hadiah',
    kategori: 'Link promo palsu',
    kronologi: 'Email promosi yang tampak resmi dari CIMB Niaga menawarkan bunga KPR 0% selama 2 tahun. Saat diklik mengarah ke form yang meminta nomor rekening.',
    bukti: 'email_screenshot.jpg',
    riskScore: 67,
    status: 'Open',
    pelapor: 'Ahmad Fauzi',
    tanggal: '2026-03-31T16:10:00',
    analisis: {
      klasifikasi: 'Mencurigakan',
      keyFindings: [
        'Email pengirim tidak menggunakan domain @cimbniaga.co.id',
        'URL dipersingkat sehingga tujuan tidak transparan',
        'Penawaran tidak sesuai dengan program resmi yang terdaftar',
      ],
      rekomendasi: 'Verifikasi manual diperlukan. Cek dengan tim marketing CIMB Niaga.',
    },
  },
  {
    id: 'T-0044',
    url: 'wa.me/628123-cimb-cs',
    kategori: 'Social engineering',
    kronologi: 'Ada yang menghubungi via WhatsApp mengaku CS CIMB Niaga, meminta OTP karena "ada transaksi mencurigakan". Saya hampir memberikan OTP tersebut.',
    bukti: null,
    riskScore: 41,
    status: 'Open',
    pelapor: 'Dewi Lestari',
    tanggal: '2026-03-31T14:55:00',
    analisis: {
      klasifikasi: 'Mencurigakan',
      keyFindings: [
        'Nomor WA bukan nomor resmi CS CIMB Niaga',
        'Pola permintaan OTP adalah ciri khas social engineering',
        'Tidak ada catatan tiket gangguan dari sistem internal',
      ],
      rekomendasi: 'Edukasi nasabah untuk tidak membagikan OTP kepada siapapun termasuk CS.',
    },
  },
  {
    id: 'T-0043',
    url: 'secure-cimb-update[.]com',
    kategori: 'Halaman login palsu',
    kronologi: 'Mendapat email dari "CIMB Niaga Security Team" bahwa akun perlu diverifikasi ulang karena aktivitas mencurigakan. Diminta login melalui link tersebut.',
    bukti: 'email_phishing.jpg',
    riskScore: 84,
    status: 'Investigasi',
    pelapor: 'Rudi Hartono',
    tanggal: '2026-03-31T11:20:00',
    analisis: {
      klasifikasi: 'Phishing',
      keyFindings: [
        'Domain baru terdaftar, bukan domain resmi CIMB',
        'Menggunakan kata "secure" untuk memberi kesan aman',
        'Konten email meniru template resmi CIMB Niaga persis',
        'Terdapat form input untuk username, password, dan PIN',
      ],
      rekomendasi: 'Segera laporkan ke BSSN. Blokir domain dan informasikan ke nasabah.',
    },
  },
  {
    id: 'T-0042',
    url: 'cimb-niaga-verify.web.id',
    kategori: 'Halaman login palsu',
    kronologi: 'Link tersebut muncul di hasil pencarian Google ketika saya mencari "login CIMB Niaga". Tampilan sangat mirip website asli.',
    bukti: 'search_result.jpg',
    riskScore: 62,
    status: 'Closed',
    pelapor: 'Maya Sari',
    tanggal: '2026-03-30T09:15:00',
    analisis: {
      klasifikasi: 'Phishing',
      keyFindings: [
        'Domain menggunakan kata "verify" dan "niaga" untuk menipu',
        'TLD .web.id tidak digunakan oleh CIMB Niaga resmi',
        'SEO poisoning — muncul di hasil pencarian',
      ],
      rekomendasi: 'Sudah ditakedown. Laporkan ke Google Search Console untuk deindeks.',
    },
  },
  {
    id: 'T-0041',
    url: 'cimb.promo-cashback.id',
    kategori: 'Link promo palsu',
    kronologi: 'Banner iklan di media sosial menawarkan cashback 50% untuk transaksi CIMB. Setelah diklik diminta isi nomor kartu kredit.',
    bukti: 'iklan_sosmed.jpg',
    riskScore: 29,
    status: 'Closed',
    pelapor: 'Eko Prasetyo',
    tanggal: '2026-03-29T15:30:00',
    analisis: {
      klasifikasi: 'Tidak Berbahaya',
      keyFindings: [
        'Domain terdaftar atas nama vendor mitra resmi CIMB Niaga',
        'SSL sertifikat valid dan dari CA terpercaya',
        'Konten promosi telah diverifikasi dengan tim marketing',
      ],
      rekomendasi: 'False positive. Tidak perlu tindakan lebih lanjut.',
    },
  },
  {
    id: 'T-0040',
    url: 'octo-cimb-fake[.]net/daftar',
    kategori: 'Halaman login palsu',
    kronologi: 'SMS berisi link untuk "daftar OCTO terbaru" dengan bonus saldo Rp 100.000. Halaman sangat mirip aplikasi OCTO.',
    bukti: 'screenshot_octo_palsu.jpg',
    riskScore: 95,
    status: 'Closed',
    pelapor: 'Fitriani',
    tanggal: '2026-03-28T10:00:00',
    analisis: {
      klasifikasi: 'Phishing',
      keyFindings: [
        'Domain meniru nama aplikasi OCTO by CIMB',
        'TLD .net bukan domain resmi',
        'Skor risiko tertinggi bulan ini',
        'Sudah ada 12 laporan serupa terkait domain ini',
      ],
      rekomendasi: 'Sudah diblokir dan dilaporkan ke BSSN. Kasus selesai.',
    },
  },
];

export const WEEKLY_TREND = [
  { hari: 'Sen', laporan: 23, risiko_tinggi: 9 },
  { hari: 'Sel', laporan: 17, risiko_tinggi: 5 },
  { hari: 'Rab', laporan: 34, risiko_tinggi: 14 },
  { hari: 'Kam', laporan: 25, risiko_tinggi: 8 },
  { hari: 'Jum', laporan: 38, risiko_tinggi: 16 },
  { hari: 'Sab', laporan: 15, risiko_tinggi: 4 },
  { hari: 'Min', laporan: 9, risiko_tinggi: 2 },
];

export const MODUS_DATA = [
  { name: 'Halaman login palsu', value: 34 },
  { name: 'SMS/WA spoofing', value: 25 },
  { name: 'Link promo palsu', value: 21 },
  { name: 'Social engineering', value: 12 },
  { name: 'Lainnya', value: 8 },
];

export const TIPS_EDUKASI = [
  {
    icon: '🔗',
    judul: 'Periksa URL dengan teliti',
    deskripsi: 'CIMB Niaga hanya menggunakan domain resmi cimbniaga.co.id. Waspada terhadap variasi seperti cimb-niaga[.]xyz, secure-cimb[.]com, atau domain yang menambahkan kata "verify", "update", atau "promo".',
    tag: 'URL & Domain',
    color: 'blue',
  },
  {
    icon: '🔐',
    judul: 'Jangan pernah bagikan OTP',
    deskripsi: 'Bank tidak pernah meminta kode OTP melalui telepon, SMS, atau chat — termasuk yang mengaku petugas CIMB Niaga. OTP hanya untuk konfirmasi transaksi yang kamu lakukan sendiri.',
    tag: 'OTP & Password',
    color: 'red',
  },
  {
    icon: '📧',
    judul: 'Verifikasi email pengirim',
    deskripsi: 'Email resmi CIMB Niaga selalu berakhiran @cimbniaga.co.id. Waspadai email dari domain yang mirip tapi berbeda, seperti @cimb-niaga.com atau @cimbniaga.net.',
    tag: 'Email',
    color: 'yellow',
  },
  {
    icon: '📱',
    judul: 'Gunakan aplikasi OCTO resmi',
    deskripsi: 'Unduh aplikasi OCTO by CIMB Niaga hanya dari Google Play Store atau App Store resmi. Jangan pernah menginstal APK dari link di SMS atau WhatsApp.',
    tag: 'Aplikasi',
    color: 'green',
  },
  {
    icon: '⚡',
    judul: 'Laporkan segera jika ada yang mencurigakan',
    deskripsi: 'Semakin cepat laporan masuk, semakin cepat tim kami dapat memblokir ancaman dan melindungi nasabah lain. Gunakan halaman laporan di platform ini atau hubungi 14041.',
    tag: 'Tindakan Cepat',
    color: 'purple',
  },
];

// Simulasi hasil analisis LLM — nanti replace dengan API call ke endpoint LLM tim
export const simulateLLMAnalysis = (url, kategori) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 55; // 55–94
      const isPhishing = score > 70;
      resolve({
        riskScore: score,
        klasifikasi: isPhishing ? 'Phishing' : 'Mencurigakan',
        keyFindings: isPhishing
          ? [
              `Domain "${url.split('/')[0]}" tidak terdaftar sebagai domain resmi CIMB Niaga`,
              'SSL sertifikat baru dibuat dalam 30 hari terakhir',
              `Kategori "${kategori}" sesuai pola serangan yang umum`,
              'Terdapat konten yang meminta data sensitif perbankan',
            ]
          : [
              `Domain "${url.split('/')[0]}" tidak ditemukan dalam daftar domain terverifikasi`,
              `Laporan dengan kategori "${kategori}" memerlukan verifikasi manual`,
              'Tidak cukup data untuk klasifikasi definitif',
            ],
        rekomendasi: isPhishing
          ? 'Risiko tinggi terdeteksi. Tim kami akan segera menginvestigasi dan memblokir domain ini.'
          : 'Risiko sedang. Tim kami akan memverifikasi laporan ini dalam 4 jam ke depan.',
      });
    }, 2500);
  });
};
