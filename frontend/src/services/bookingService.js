import api from './Api'; // Using the interceptor we built in Phase 1.1

export const getAvailableUnits = async () => {
  const response = await api.get('/api/bookings/availableunits');
  return response.data;
};

export const createPendingBooking = async (examUnitId) => {
  const response = await api.post('/api/bookings/createbooking', { examUnitId });
  return response.data; // Returns BookingResponseDto
};

export const initiatePayment = async (bookingId, phoneNumber) => {
  const response = await api.post(`/api/bookings/${bookingId}/pay`, { phoneNumber });
  return response.data; // Returns BookingResponseDto
};