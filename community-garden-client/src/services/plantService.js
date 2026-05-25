import axios from 'axios';

const BASE = '/api/plants';

const plantService = {
  getAll: async ()             => (await axios.get(BASE)).data,
  getById: async (id)          => (await axios.get(`${BASE}/${id}`)).data,
  getByCategory: async (cat)   => (await axios.get(`${BASE}/category?name=${cat}`)).data,
  getByPlot: async (plotId)    => (await axios.get(`${BASE}/plot/${plotId}`)).data,
  create: async (data)         => (await axios.post(BASE, data)).data,
  update: async (id, data)     => (await axios.put(`${BASE}/${id}`, data)).data,
  remove: async (id)           => (await axios.delete(`${BASE}/${id}`)).data,
};

export default plantService;
