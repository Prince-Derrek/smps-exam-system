import api from './auth'; // Import the intercepted Axios instance from Phase 1

export const verifyTicket = async (ticketId) => {
  // This URL exactly matches the TicketsController we built in the last step
  const response = await api.post(`/api/tickets/${ticketId}/verify`);
  
  // Returns TicketVerificationResponseDto (StudentName, RegNo, UnitTitle, etc.)
  return response.data; 
};

export const getScanHistory = async () => {
  const response = await api.get('/api/tickets/history');
  return response.data;
};