import { createContext, useContext, useState } from 'react'
import { DUMMY_TICKETS } from '../data/dummyData'

const TicketContext = createContext(null)

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(DUMMY_TICKETS)

  // TODO: Replace dengan POST /api/reports
  const addTicket = (data) => {
    const lastId = parseInt(tickets[0]?.id?.split('-')[1] || '47')
    const newTicket = {
      id: `T-${String(lastId + 1).padStart(4, '0')}`,
      ...data,
      status: 'Open',
      tanggal: new Date().toISOString(),
      adminValidated: false,
      adminOverrideScore: null,
      adminNotes: '',
    }
    setTickets((prev) => [newTicket, ...prev])
    return newTicket.id
  }

  // TODO: Replace dengan PATCH /api/tickets/:id/validate
  const validateTicket = (id, { overrideScore, notes }) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              adminValidated: true,
              adminOverrideScore: overrideScore ?? null,
              adminNotes: notes ?? '',
              riskScore: overrideScore != null ? overrideScore : t.riskScore,
              status: t.status === 'Open' ? 'Investigasi' : t.status,
            }
          : t
      )
    )
  }

  // TODO: Replace dengan PATCH /api/tickets/:id/status
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
    <TicketContext.Provider value={{ tickets, addTicket, validateTicket, updateStatus, getTicketById, stats }}>
      {children}
    </TicketContext.Provider>
  )
}

export const useTickets = () => useContext(TicketContext)
