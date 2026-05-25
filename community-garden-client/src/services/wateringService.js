import axios from 'axios';

const BASE = '/api/watering';

const wateringService = {
  getAll: async ()           => (await axios.get(BASE)).data,
  getUpcoming: async ()      => (await axios.get(`${BASE}/upcoming`)).data,
  getByPlot: async (plotId)  => (await axios.get(`${BASE}/plot/${plotId}`)).data,
  create: async (data)       => (await axios.post(BASE, data)).data,
  update: async (id, data)   => (await axios.put(`${BASE}/${id}`, data)).data,
  remove: async (id)         => (await axios.delete(`${BASE}/${id}`)).data,
};

export default wateringService;
