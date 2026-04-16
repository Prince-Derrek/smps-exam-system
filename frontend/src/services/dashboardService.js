import api from './auth';

export const fetchDashboardData = async () => {
  const response = await api.get('/api/v1/StudentsDashboard/dashboard');
  return response.data;
};