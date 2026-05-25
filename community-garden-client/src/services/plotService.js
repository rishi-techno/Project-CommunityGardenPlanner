import axios from 'axios';

const BASE = '/api/plots';

const plotService = {
  getAll: async ()           => (await axios.get(BASE)).data,
  getById: async (id)        => (await axios.get(`${BASE}/${id}`)).data,
  getAvailable: async ()     => (await axios.get(`${BASE}/available`)).data,
  search: async (keyword)    => (await axios.get(`${BASE}/search?keyword=${keyword}`)).data,
  create: async (data)       => (await axios.post(BASE, data)).data,
  update: async (id, data)   => (await axios.put(`${BASE}/${id}`, data)).data,
  remove: async (id)         => (await axios.delete(`${BASE}/${id}`)).data,
};

export default plotService;
