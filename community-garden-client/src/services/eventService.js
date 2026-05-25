import axios from 'axios';

const BASE = '/api/events';

const eventService = {
  getAll: async ()           => (await axios.get(BASE)).data,
  getById: async (id)        => (await axios.get(`${BASE}/${id}`)).data,
  getUpcoming: async ()      => (await axios.get(`${BASE}/upcoming`)).data,
  create: async (data)       => (await axios.post(BASE, data)).data,
  update: async (id, data)   => (await axios.put(`${BASE}/${id}`, data)).data,
  remove: async (id)         => (await axios.delete(`${BASE}/${id}`)).data,
};

export default eventService;
