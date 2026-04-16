import api from './auth'; // Using the intercepted Axios instance

export const getAdminStats = async () => {
  const response = await api.get('/api/admin/stats');
  return response.data;
};

export const adminLogin = async (email, password) => {
  const response = await api.post('/api/admin/login', { email, password });
  return response.data;
}

export const getAdminExamUnits = async () => {
  const response = await api.get('/api/admin/exam-units');
  return response.data;
};

export const createExamUnit = async (data) => {
  const response = await api.post('/api/admin/exam-units', data);
  return response.data;
};

export const updateExamUnit = async (id, data) => {
  const response = await api.put(`/api/admin/exam-units/${id}`, data);
  return response.data;
};

export const getAdminStudents = async () => {
  const response = await api.get('/api/admin/students');
  return response.data;
};

export const getAdminBookings = async () => {
  const response = await api.get('/api/admin/bookings');
  return response.data;
};

export const getAdminPayments = async () => {
  const response = await api.get('/api/admin/payments');
  return response.data;
};

export const getAdminInvigilators = async () => {
  const response = await api.get('/api/admin/invigilators');
  return response.data;
};

export const registerInvigilator = async (data) => {
  const response = await api.post('/api/admin/invigilators', data);
  return response.data;
};

export const getAdminTrends = async (days = 30) => {
  const response = await api.get(`/api/admin/trends?days=${days}`);
  return response.data;
};