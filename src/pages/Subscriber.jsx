import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Subscriber = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ví dụ filter TYPE=someValue, thêm query ?TYPE=...&PROVINCE=...
    axios.get('http://localhost:5000/api/subscribers/filter') // Hoặc thêm params
      .then(response => {
        setSubscribers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching subscribers:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Trang Subscriber</h2>
      {loading ? <p>Đang tải...</p> : (
        <table className="w-full bg-white shadow">
          <thead>
            <tr><th>SUB_ID</th><th>TYPE</th><th>PROVINCE</th><th>STA_DATE</th></tr>
          </thead>
          <tbody>
            {subscribers.map(sub => (
              <tr key={sub._id}>
                <td>{sub.SUB_ID}</td>
                <td>{sub.TYPE}</td>
                <td>{sub.PROVINCE}</td>
                <td>{new Date(sub.STA_DATE).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Subscriber;