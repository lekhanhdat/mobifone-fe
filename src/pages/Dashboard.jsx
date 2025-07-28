import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, newSubscribers: 0, canceledSubscribers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats/summary') // Có thể thêm ?startDate=...&endDate=...
      .then(response => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Trang Dashboard</h2>
      {loading ? <p>Đang tải...</p> : (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 shadow">Tổng thuê bao: {stats.total}</div>
          <div className="bg-white p-4 shadow">Thuê bao mới: {stats.newSubscribers}</div>
          <div className="bg-white p-4 shadow">Thuê bao hủy: {stats.canceledSubscribers}</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;