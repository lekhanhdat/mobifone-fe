import axiosClient from './axiosClient';

const statService = {
  getSummary: () => axiosClient.get('/stats/summary'),

  getTrends: (params) => axiosClient.get('/stats/trends', { params }),

  getPackageStats: () => axiosClient.get('/stats/packages'),
};

export default statService;
