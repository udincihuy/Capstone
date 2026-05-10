import { createContext, useContext, useState, useEffect } from 'react'

const TicketContext = createContext(null)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch tickets dari backend API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE}/admin/submissions?sort_by_risk=true&limit=100`)
        if (!response.ok) throw new Error('Failed to fetch submissions')
        const data = await response.json()
        
        // Transform backend data ke format frontend
        const transformed = data.map((sub) => ({
          id: sub.ticket_id,
          jenis: 'SMS', // TODO: tambah message_type ke backend
          pesan: sub.raw_message,
          pelapor: 'Anonymous',
          email: 'anonymous@example.com',
          tanggal: sub.created_at,
          status: sub.status === 'on_review' ? 'Open' : 'Investigasi',
          extractedUrls: sub.extracted_urls || [],
          extractedPhones: sub.extracted_phones || [],
          extractedEmails: [],
          riskScore: sub.risk_score,
          adminValidated: sub.status === 'reviewed',
          adminOverrideScore: null,
          adminNotes: '',
        }))
        
        setTickets(transformed)
      } catch (error) {
        console.error('Error fetching tickets:', error)
        setTickets([])
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
    // Polling setiap 5 detik untuk update real-time
    const interval = setInterval(fetchTickets, 5000)
    return () => clearInterval(interval)
  }, [])

  // Submit ticket baru ke backend
  const addTicket = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_message: data.pesan,
          message_type: data.jenis?.toLowerCase() || 'sms',
        }),
      })
      if (!response.ok) throw new Error('Failed to submit')
      const result = await response.json()
      
      // Refresh tickets setelah submit
      setTimeout(() => {
        window.location.reload() // atau gunakan fetchTickets() jika sudah di-extract
      }, 1000)
      
      return result.ticket_id
    } catch (error) {
      console.error('Error submitting ticket:', error)
      throw error
    }
  }

  // Update status/decision ticket
  const validateTicket = async (id, { overrideScore, notes }) => {
    try {
      const response = await fetch(`${API_BASE}/admin/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'reviewed',
          final_decision: overrideScore > 50 ? 'phishing' : 'safe',
        }),
      })
      if (!response.ok) throw new Error('Failed to update')
      
      // Update state lokal
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                adminValidated: true,
                adminOverrideScore: overrideScore ?? null,
                adminNotes: notes ?? '',
                riskScore: overrideScore != null ? overrideScore : t.riskScore,
                status: 'Investigasi',
              }
            : t
        )
      )
    } catch (error) {
      console.error('Error validating ticket:', error)
      throw error
    }
  }

  const updateStatus = (id, status) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    )
  }

  const getTicketById = (id) => tickets.find((t) => t.id === id)

  const stats = {
    total:           tickets.length,
    open:            tickets.filter((t) => t.status === 'Open').length,
    investigasi:     tickets.filter((t) => t.status === 'Investigasi').length,
    closed:          tickets.filter((t) => t.status === 'Closed').length,
    risikoTinggi:    tickets.filter((t) => t.riskScore >= 70).length,
    belumDivalidasi: tickets.filter((t) => !t.adminValidated).length,
  }

  return (
    <TicketContext.Provider value={{ tickets, addTicket, validateTicket, updateStatus, getTicketById, stats, loading }}>
      {children}
    </TicketContext.Provider>
  )
}

export const useTickets = () => useContext(TicketContext)
