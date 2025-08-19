import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Package = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pieProvince, setPieProvince] = useState({ labels: [], datasets: [] });
  const [pieDistrict, setPieDistrict] = useState({ labels: [], datasets: [] });

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

  useEffect(() => {
    const fetchPies = async () => {
      try {
        const [prov, dist] = await Promise.all([
          axios.get('http://localhost:5000/api/subscribers/pie?groupBy=province&hasPackage=true'),
          axios.get('http://localhost:5000/api/subscribers/pie?groupBy=district&hasPackage=true')
        ]);
        const totalProv = prov.data.reduce((sum, item) => sum + item.value, 0);
        const totalDist = dist.data.reduce((sum, item) => sum + item.value, 0);
        const pastelColors = ['#A7C7E7', '#B9D7EA', '#D6EAF8', '#E0F7FA', '#E8F5E9', '#FBE9E7', '#FFECB3', '#FFE0B2'];

        setPieProvince({
          labels: prov.data.map(item => `${item.label} (${((item.value / totalProv) * 100).toFixed(1)}%)`),
          datasets: [{ data: prov.data.map(item => item.value), backgroundColor: pastelColors }]
        });

        setPieDistrict({
          labels: dist.data.map(item => `${item.label} (${((item.value / totalDist) * 100).toFixed(1)}%)`),
          datasets: [{ data: dist.data.map(item => item.value), backgroundColor: pastelColors }]
        });
      } catch (err) {
        console.error('Error fetching pie data for packages:', err);
      }
    };
    fetchPies();
  }, []);

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 mt-2">Quản Lý Gói Cước</h2>

      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="w-full md:w-1/2 p-4 bg-white rounded shadow">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Phân Bổ Thuê Bao Có Gói Cước Theo Tỉnh</h3>
          <Pie data={pieProvince} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
        </div>
        <div className="w-full md:w-1/2 p-4 bg-white rounded shadow mt-4 md:mt-0 md:ml-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Phân Bổ Thuê Bao Có Gói Cước Theo Quận/Huyện</h3>
          <Pie data={pieDistrict} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
        </div>
      </div>

      <div className="mb-8 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-bold text-blue-600 mb-4">Danh Sách Gói Cước (Chỉ Có Gói)</h3>
        {loading ? <p className="text-blue-600">Đang tải...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Gói Cước</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge Riêng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Số Lượng Đăng Ký</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Charge</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-gray-500 text-center">Không có gói cước nào</td>
                  </tr>
                ) : (
                  packages.map(pkg => (
                    <tr key={pkg._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{pkg._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{pkg.avgCharge.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{pkg.count.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{pkg.totalCharge.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Package;