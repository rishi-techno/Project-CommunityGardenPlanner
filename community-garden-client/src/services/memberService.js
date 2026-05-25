import axios from 'axios';

const BASE = '/api/members';

const memberService = {
  getAll: async ()    => (await axios.get(BASE)).data,
  getById: async (id) => (await axios.get(`${BASE}/${id}`)).data,
  remove: async (id)  => (await axios.delete(`${BASE}/${id}`)).data,
};

export default memberService;
