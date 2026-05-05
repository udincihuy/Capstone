import { createContext, useContext, useState } from 'react'
import { DUMMY_TICKETS } from '../data/dummyData'

const TicketContext = createContext(null)

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(DUMMY_TICKETS)

  const addTicket = (ticketData) => {
    const newTicket = {
      id: `T-${String(parseInt(tickets[0].id.split('-')[1]) + 1).padStart(4, '0')}`,
      ...ticketData,
      status: 'Open',
      tanggal: new Date().toISOString(),
    }
    setTickets((prev) => [newTicket, ...prev])
    return newTicket.id
  }

  const getTicketById = (id) => tickets.find((t) => t.id === id)

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    investigasi: tickets.filter((t) => t.status === 'Investigasi').length,
    closed: tickets.filter((t) => t.status === 'Closed').length,
    risikoTinggi: tickets.filter((t) => t.riskScore >= 70).length,
  }

  return (
    <TicketContext.Provider value={{ tickets, addTicket, getTicketById, stats }}>
      {children}
    </TicketContext.Provider>
  )
}

export const useTickets = () => useContext(TicketContext)
