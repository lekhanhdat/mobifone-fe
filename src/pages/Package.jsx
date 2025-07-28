import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Package = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats/packages')
      .then(response => {
        setPackages(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching packages:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Trang Package</h2>
      {loading ? <p>Đang tải...</p> : (
        <ul className="space-y-2">
          {packages.map(pkg => (
            <li key={pkg._id} className="bg-white p-2 shadow">
              Gói: {pkg._id} - Tổng charge: {pkg.totalCharge} - Số lượng: {pkg.count}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Package;