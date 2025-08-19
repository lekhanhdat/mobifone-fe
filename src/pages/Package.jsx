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
  const [filters, setFilters] = useState({ search: '', sortBy: 'count', sortOrder: 'desc' });
  const [newPackage, setNewPackage] = useState({ PCK_CODE: '', PCK_CHARGE: '' });

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
      const response = await axios.get(`http://localhost:5000/api/stats/packages?${params}`);
      setPackages(response.data);
    } catch (err) {
      console.error('Error fetching packages:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, [filters]);

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

  const handleSort = (column) => {
    const newOrder = (filters.sortBy === column && filters.sortOrder === 'desc') ? 'asc' : 'desc';
    setFilters(prev => ({ ...prev, sortBy: column, sortOrder: newOrder }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleNewPackageChange = (e) => {
    const { name, value } = e.target;
    setNewPackage(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/packages', newPackage);
      setNewPackage({ PCK_CODE: '', PCK_CHARGE: '' });
      fetchPackages(); // Refresh table
      alert(response.data.message); // 'Thêm thành công'
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi thêm gói cước');
    }
  };

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
        <h3 className="text-lg font-bold mb-2">Thêm Gói Cước Mới</h3>
        <form onSubmit={handleAddPackage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="PCK_CODE" value={newPackage.PCK_CODE} onChange={handleNewPackageChange} placeholder="Tên gói cước (PCK_CODE)" className="p-2 border rounded" required />
          <input type="number" name="PCK_CHARGE" value={newPackage.PCK_CHARGE} onChange={handleNewPackageChange} placeholder="Giá gói cước (PCK_CHARGE)" className="p-2 border rounded" required />
          <button type="submit" className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded">Thêm</button>
        </form>
      </div>

      <div className="mb-8 bg-white p-4 rounded shadow relative">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Danh Sách Gói Cước (Chỉ Có Gói)</h3>
          <input type="text" value={filters.search} onChange={handleSearchChange} placeholder="Tìm tên gói cước" className="w-1/3 p-2 border rounded focus:outline-none focus:border-blue-600" />
        </div>

        {/* Loading overlay to avoid flash */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <p className="text-blue-600">Đang tải...</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Gói Cước</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charge Riêng
                  <button onClick={() => handleSort('charge')} className="ml-2 text-blue-600 hover:text-blue-800">
                    {filters.sortBy === 'charge' && filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng Số Lượng Đăng Ký
                  <button onClick={() => handleSort('count')} className="ml-2 text-blue-600 hover:text-blue-800">
                    {filters.sortBy === 'count' && filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng Charge
                  <button onClick={() => handleSort('totalCharge')} className="ml-2 text-blue-600 hover:text-blue-800">
                    {filters.sortBy === 'totalCharge' && filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-gray-500 text-center">Không có gói cước nào</td>
                </tr>
              ) : (
                packages.map((pkg, index) => (
                  <tr key={pkg._id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition`}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{pkg._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{pkg.charge.toLocaleString('de-DE')}</td> 
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{pkg.count.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{pkg.totalCharge.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Package;