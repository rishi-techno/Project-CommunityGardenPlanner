import axios from 'axios';

const BASE = '/api/auth';

const authService = {
  login: async (credentials) => {
    const res = await axios.post(`${BASE}/login`, credentials);
    return res.data;
  },

  register: async (data) => {
    const res = await axios.post(`${BASE}/register`, data);
    return res.data;
  },
};

// Attach token to every request automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('gardenToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gardenToken');
      localStorage.removeItem('gardenUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default authService;
