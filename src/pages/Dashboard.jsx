import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { BsPeople, BsPersonAdd, BsPersonDash, BsBox } from 'react-icons/bs';
import { Link } from 'react-router-dom'; // Import Link để navigation

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, newSubs: 0, canceledSubs: 0, totalPackages: 0, percentNew: 0, percentCanceled: 0 });
  const [trend, setTrend] = useState([]);
  const [packageTrend, setPackageTrend] = useState([]);
  const [filter, setFilter] = useState({ from: '', to: '', province: '', district: '' });
  const [options, setOptions] = useState({ provinces: [] });
  const [districtOptions, setDistrictOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/subscribers/options');
        setOptions(res.data);
      } catch (err) {
        console.error('Error fetching options:', err);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (filter.province) {
        try {
          const res = await axios.get(`http://localhost:5000/api/subscribers/districts?province=${filter.province}`);
          setDistrictOptions(res.data);
        } catch (err) {
          console.error('Error fetching districts:', err);
          setDistrictOptions([]);
        }
      } else {
        setDistrictOptions([]);
      }
    };
    fetchDistricts();
  }, [filter.province]);

useEffect(() => {
  const fetchData = async () => {
    // setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.from) {
        const [fromYear, fromMonth] = filter.from.split('-');
        params.append('fromMonth', fromMonth);
        params.append('fromYear', fromYear);
      }
      if (filter.to) {
        const [toYear, toMonth] = filter.to.split('-');
        params.append('toMonth', toMonth);
        params.append('toYear', toYear);
      }
      if (filter.province) params.append('province', filter.province);
      if (filter.district) params.append('district', filter.district);

      const statsRes = await axios.get(`http://localhost:5000/api/stats/summary?${params.toString()}`);
      setStats(statsRes.data);
      const trendRes = await axios.get(`http://localhost:5000/api/stats/trend?${params.toString()}`);
      setTrend(trendRes.data || []); // Fallback empty array

      // Fetch cho package trend 
      const packageTrendRes = await axios.get(`http://localhost:5000/api/stats/package-trend?${params.toString()}`);
      setPackageTrend(packageTrendRes.data || []); // Fallback
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'province') {
      setFilter({ ...filter, province: value, district: '' });
    } else {
      setFilter({ ...filter, [name]: value });
    }
  };

  if (loading) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;

  // Data cho biểu đồ thuê bao
  const labels = trend.map(t => t.label);
  const dataPoints = trend.map(t => t.count);
  const lineData = {
    labels,
    datasets: [{
      label: 'Thuê bao mới',
      data: dataPoints,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  };

  // Data cho biểu đồ gói cước 
  const packageLabels = packageTrend.map(t => t.label); 
  const packageDataPoints = packageTrend.map(t => t.count);
  const packageLineData = {
    labels: packageLabels,
    datasets: [{
      label: 'Gói cước mới',
      data: packageDataPoints,
      borderColor: '#3b82f6', // Màu amber để phân biệt
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true, suggestedMin: 0,
        ticks: { callback: (value) => value.toLocaleString() },
      },
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 12 },
      },
    },
  };

  const PercentChange = ({ value }) => (
    <p className="text-sm">
      <span className={value > 0 ? 'text-green-500' : 'text-red-500'}>
        {value > 0 ? '↑' : '↓'} {Math.abs(value)}%
      </span> so với kỳ trước
    </p>
  );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 mt-2">Dashboard</h2>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card Tổng số thuê bao - Link đến /subscriber */}
        <Link to="/subscriber" className="bg-white p-6 rounded-lg shadow-md flex items-center border border-blue-100 hover:shadow-lg transition-shadow cursor-pointer">
          <BsPeople className="text-purple-600 text-4xl mr-4 bg-purple-100 p-2 rounded-full" />
          <div>
            <p className="text-sm text-gray-600">Tổng số thuê bao</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total.toLocaleString()}</p>
          </div>
        </Link>
        {/* Card Thuê bao mới - Không link (theo yêu cầu chỉ 2 card cụ thể) */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center border border-blue-100 hover:shadow-lg transition-shadow">
          <BsPersonAdd className="text-green-600 text-4xl mr-4 bg-green-100 p-2 rounded-full" />
          <div>
            <p className="text-sm text-gray-600">Thuê bao mới</p>
            <p className="text-2xl font-bold text-blue-600">{stats.newSubs.toLocaleString()}</p>
            <PercentChange value={stats.percentNew} />
          </div>
        </div>
        {/* Card Thuê bao hủy - Không link */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center border border-blue-100 hover:shadow-lg transition-shadow">
          <BsPersonDash className="text-red-600 text-4xl mr-4 bg-red-100 p-2 rounded-full" />
          <div>
            <p className="text-sm text-gray-600">Thuê bao hủy</p>
            <p className="text-2xl font-bold text-blue-600">{stats.canceledSubs.toLocaleString()}</p>
            <PercentChange value={stats.percentCanceled} />
          </div>
        </div>
        {/* Card Tổng số gói cước đăng ký - Link đến /package */}
        <Link to="/package" className="bg-white p-6 rounded-lg shadow-md flex items-center border border-blue-100 hover:shadow-lg transition-shadow cursor-pointer">
          <BsBox className="text-yellow-600 text-4xl mr-4 bg-yellow-100 p-2 rounded-full" />
          <div>
            <p className="text-sm text-gray-600">Tổng số gói cước đăng ký</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalPackages.toLocaleString()}</p>
          </div>
        </Link>
      </div>
      {/* Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Từ (tháng/năm)</label>
          <input type="month" name="from" value={filter.from} onChange={handleFilterChange} className="w-full p-3 border border-blue-200 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:shadow-md transition duration-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Đến (tháng/năm)</label>
          <input type="month" name="to" value={filter.to} onChange={handleFilterChange} className="w-full p-3 border border-blue-200 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:shadow-md transition duration-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh</label>
          <select name="province" value={filter.province} onChange={handleFilterChange} className="w-full p-3 border border-blue-200 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:shadow-md transition duration-200">
            <option value="">Chọn tỉnh</option>
            {(options.provinces || []).map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện</label>
          <select name="district" value={filter.district} onChange={handleFilterChange} className="w-full p-3 border border-blue-200 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hover:shadow-md transition duration-200" disabled={!filter.province}>
            <option value="">Chọn quận/huyện</option>
            {districtOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
      </div>
      {/* Line Chart */}
      {/* Biểu đồ đường hiện tại (thuê bao) */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100 mb-6"> {/* Thêm mb-6 để khoảng cách với biểu đồ mới */}
        <h3 className="text-xl font-bold text-blue-600 mb-4">Xu hướng phát triển thuê bao (dựa trên thuê bao mới)</h3>
        <Line data={lineData} options={lineOptions} />
      </div>
      {/* Biểu đồ đường mới (gói cước) - Giao diện tương tự, đặt phía dưới */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
        <h3 className="text-xl font-bold text-blue-600 mb-4">Xu hướng phát triển gói cước (dựa trên đăng ký mới)</h3>
        <Line data={packageLineData} options={lineOptions} />
      </div>
    </div>
  );
};

export default Dashboard;