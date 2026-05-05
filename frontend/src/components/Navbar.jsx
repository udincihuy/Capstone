import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-cimb-red rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <div>
                <div className="text-cimb-red font-bold text-sm leading-tight">CIMB Niaga</div>
                <div className="text-gray-400 text-[9px] leading-tight tracking-wide">PhishGuard</div>
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <Link
              to="/laporan"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/laporan'
                  ? 'bg-cimb-light text-cimb-red'
                  : 'text-gray-600 hover:text-cimb-red hover:bg-gray-50'
              }`}
            >
              Laporkan Phishing
            </Link>
            <Link
              to="/edukasi"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/edukasi'
                  ? 'bg-cimb-light text-cimb-red'
                  : 'text-gray-600 hover:text-cimb-red hover:bg-gray-50'
              }`}
            >
              Edukasi Keamanan
            </Link>
            <Link
              to="/admin"
              className="ml-2 text-xs text-gray-400 hover:text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Admin ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Red strip bawah logo seperti CIMB asli */}
      <div className="h-0.5 bg-cimb-red" />
    </nav>
  )
}
