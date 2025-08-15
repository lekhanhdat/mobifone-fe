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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, newSubs: 0, canceledSubs: 0, totalPackages: 0, percentNew: 0, percentCanceled: 0 });
  const [trend, setTrend] = useState([]);
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
        setTrend(trendRes.data);
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

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
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
      </span> so với tháng trước
    </p>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <BsPeople className="text-purple-600 text-3xl mr-4 bg-purple-100 p-2 rounded-full" />
          <div>
            <p className="text-sm text-gray-500">Tổng số thuê bao</p>
            <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <BsPersonAdd className="text-green-600 text-3xl mr-4 bg-green-100 p-2 rounded-full" />
          <div>
            <p className="text-sm text-gray-500">Thuê bao mới</p>
            <p className="text-2xl font-bold">{stats.newSubs.toLocaleString()}</p>
            <PercentChange value={stats.percentNew} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <BsPersonDash className="text-red-600 text-3xl mr-4 bg-red-100 p-2 rounded-full" />
          <div>
            <p className="text-sm text-gray-500">Thuê bao hủy</p>
            <p className="text-2xl font-bold">{stats.canceledSubs.toLocaleString()}</p>
            <PercentChange value={stats.percentCanceled} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <BsBox className="text-yellow-600 text-3xl mr-4 bg-yellow-100 p-2 rounded-full" />
          <div>
            <p className="text-sm text-gray-500">Tổng số gói cước đăng ký</p>
            <p className="text-2xl font-bold">{stats.totalPackages.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Từ (tháng/năm)</label>
          <input type="month" name="from" value={filter.from} onChange={handleFilterChange} className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:shadow-md transition duration-200 cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Đến (tháng/năm)</label>
          <input type="month" name="to" value={filter.to} onChange={handleFilterChange} className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:shadow-md transition duration-200 cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh</label>
          <select name="province" value={filter.province} onChange={handleFilterChange} className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:shadow-md transition duration-200 cursor-pointer">
            <option value="">Chọn tỉnh</option>
            {(options.provinces || []).map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
          <select name="district" value={filter.district} onChange={handleFilterChange} className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:shadow-md transition duration-200 cursor-pointer" disabled={!filter.province}>
            <option value="">Chọn quận/huyện</option>
            {districtOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Xu hướng phát triển thuê bao (dựa trên thuê bao mới)</h3>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
};

export default Dashboard;