import axios from './axiosClient'; 

export const getAllSubscribers = async () => {
  const res = await axios.get('/subscribers');
  return res.data;
};
