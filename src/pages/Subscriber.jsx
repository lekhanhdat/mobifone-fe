import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Papa from 'papaparse';

ChartJS.register(ArcElement, Tooltip, Legend);

const Subscriber = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ type: '', staType: '', subType: '', province: '', district: '', search: '' });
  const [options, setOptions] = useState({ provinces: [], staTypes: [], subTypes: [] }); // Now array of {value, label}
  const [districtOptions, setDistrictOptions] = useState([]);
  const [pieProvince, setPieProvince] = useState({ labels: [], datasets: [] });
  const [pieDistrict, setPieDistrict] = useState({ labels: [], datasets: [] });
  const [selectedSub, setSelectedSub] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [newSub, setNewSub] = useState({
    TYPE: '', STA_TYPE: '', SUB_ID: '', SUB_TYPE: '', STA_DATE: '', END_DATE: '', PROVINCE: '', DISTRICT: '',
    PCK_CODE: '', PCK_DATE: '', PCK_CHARGE: ''
  }); // Full fields
  const [breakdownTab, setBreakdownTab] = useState('province-district');
  const [breakdownData, setBreakdownData] = useState([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0); // To force refetch after CRUD

  // Function map TYPE
  const mapType = (type) => {
    if (type === 'C') return 'Trả trước';
    if (type === 'F') return 'Trả sau';
    return type || '';
  };

  // Fetch options with full names
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

  // Fetch districts by province
  useEffect(() => {
    if (filters.province) {
      axios.get(`http://localhost:5000/api/subscribers/districts?province=${filters.province}`)
        .then(res => setDistrictOptions(res.data)) // res.data is [{value, label}]
        .catch(err => console.error('Error fetching districts:', err));
    } else {
      setDistrictOptions([]);
    }
  }, [filters.province]);

  // Fetch subscribers
  const fetchSubs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit,
        ...(filters.type && { type: filters.type }),
        ...(filters.staType && { staType: filters.staType }),
        ...(filters.subType && { subType: filters.subType }),
        ...(filters.province && { province: filters.province }),
        ...(filters.district && { district: filters.district }),
        ...(filters.search && { search: filters.search })
      });
      const res = await axios.get(`http://localhost:5000/api/subscribers?${params}`);
      setSubscribers(res.data.subscribers);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubs();
  }, [page, filters, refetchTrigger]); // Refetch on trigger

  // Fetch pies
  useEffect(() => {
    const fetchPies = async () => {
      try {
        const [prov, dist] = await Promise.all([
          axios.get('http://localhost:5000/api/subscribers/pie?groupBy=province'),
          axios.get('http://localhost:5000/api/subscribers/pie?groupBy=district')
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
        console.error('Error fetching pie data:', err);
      }
    };
    fetchPies();
  }, []);

  // Fetch breakdown
  useEffect(() => {
    const fetchBreakdown = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/subscribers/breakdown?groupBy=${breakdownTab}`);
        setBreakdownData(res.data);
      } catch (err) {
        console.error('Error fetching breakdown:', err);
      }
    };
    fetchBreakdown();
  }, [breakdownTab]);

  // Handle filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ type: '', staType: '', subType: '', province: '', district: '', search: '' });
    setPage(1);
  };

  // Handle add
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/subscribers', newSub);
      setNewSub({ TYPE: '', STA_TYPE: '', SUB_ID: '', SUB_TYPE: '', STA_DATE: '', END_DATE: '', PROVINCE: '', DISTRICT: '', PCK_CODE: '', PCK_DATE: '', PCK_CHARGE: '' });
      setRefetchTrigger(prev => prev + 1); // Trigger refetch
      alert('Thêm thành công!'); // Add thông báo
    } catch (err) {
      console.error('Error adding:', err);
      alert('Lỗi khi thêm: ' + (err.response?.data?.message || err.message)); // Error message
    }
  };

  // Handle edit
  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/subscribers/${selectedSub._id}`, selectedSub);
      setIsEdit(false);
      setSelectedSub(null);
      setRefetchTrigger(prev => prev + 1);
      alert('Cập nhật thành công!');
    } catch (err) {
      console.error('Error editing:', err);
      alert('Lỗi khi cập nhật: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa?')) {
      try {
        await axios.delete(`http://localhost:5000/api/subscribers/${id}`);
        setRefetchTrigger(prev => prev + 1);
        alert('Xóa thành công!');
      } catch (err) {
        console.error('Error deleting:', err);
        alert('Lỗi khi xóa: ' + err.message);
      }
    }
  };

  // Export CSV (current page, with UTF-8 BOM)
  const exportCSV = () => {
    const csvData = subscribers.map(sub => ({
      SUB_ID: sub.SUB_ID,
      TYPE: mapType(sub.TYPE),
      STA_TYPE: sub.fullStaType,
      STA_DATE: new Date(sub.STA_DATE).toLocaleDateString(),
      SUB_TYPE: sub.fullSubType,
      PROVINCE: sub.fullProvince,
      DISTRICT: sub.fullDistrict,
      PCK_CODE: sub.PCK_CODE,
      PCK_DATE: sub.PCK_DATE ? new Date(sub.PCK_DATE).toLocaleDateString() : ''
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM fix tiếng Việt
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'subscribers.csv';
    link.click();
  };

  // Modal close
  const closeModal = () => {
    setSelectedSub(null);
    setIsEdit(false);
  };

  // Open details
  const openDetails = (sub) => {
    setSelectedSub(sub);
  };

  // Pagination
  const totalPages = Math.ceil(total / limit);
  const pagination = (
    <div className="flex justify-between mt-4">
      <p>Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total}</p>
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 bg-blue-100 text-blue-600 rounded">Prev</button>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 bg-blue-100 text-blue-600 rounded ml-2">Next</button>
      </div>
    </div>
  );

  // Handle change in modal/edit
  const handleSubChange = (e) => {
    const { name, value } = e.target;
    setSelectedSub(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 bg-blue-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Trang Thuê Bao</h2>

      {/* Pie Charts - Adjust width: province nhỏ hơn, district lớn hơn cho legend */}
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="w-full md:w-5/12 p-4 bg-white rounded shadow"> {/* Nhỏ hơn */}
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Tỉ Lệ Tỉnh Thành</h3>
          <Pie data={pieProvince} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
        </div>
        <div className="w-full md:w-7/12 p-4 bg-white rounded shadow mt-4 md:mt-0 md:ml-4"> {/* Lớn hơn */}
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Tỉ Lệ Quận/Huyện</h3>
          <Pie data={pieDistrict} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
        </div>
      </div>

      {/* Add Form - Full fields */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-blue-600">Thêm Thuê Bao Mới</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="SUB_ID" value={newSub.SUB_ID} onChange={(e) => setNewSub({ ...newSub, SUB_ID: e.target.value })} placeholder="Mã thuê bao (SUB_ID)" className="p-2 border rounded" required />
          <input name="TYPE" value={newSub.TYPE} onChange={(e) => setNewSub({ ...newSub, TYPE: e.target.value })} placeholder="Hình thức (TYPE: C/F)" className="p-2 border rounded" required />
          <input name="STA_TYPE" value={newSub.STA_TYPE} onChange={(e) => setNewSub({ ...newSub, STA_TYPE: e.target.value })} placeholder="Loại hòa mạng (STA_TYPE)" className="p-2 border rounded" required />
          <input name="SUB_TYPE" value={newSub.SUB_TYPE} onChange={(e) => setNewSub({ ...newSub, SUB_TYPE: e.target.value })} placeholder="Loại thuê bao (SUB_TYPE)" className="p-2 border rounded" required />
          <input name="STA_DATE" value={newSub.STA_DATE} onChange={(e) => setNewSub({ ...newSub, STA_DATE: e.target.value })} placeholder="Ngày hòa mạng (STA_DATE: YYYY-MM-DD)" type="date" className="p-2 border rounded" required />
          <input name="END_DATE" value={newSub.END_DATE} onChange={(e) => setNewSub({ ...newSub, END_DATE: e.target.value })} placeholder="Ngày kết thúc (END_DATE: YYYY-MM-DD)" type="date" className="p-2 border rounded" />
          <input name="PROVINCE" value={newSub.PROVINCE} onChange={(e) => setNewSub({ ...newSub, PROVINCE: e.target.value })} placeholder="Tỉnh (PROVINCE)" className="p-2 border rounded" required />
          <input name="DISTRICT" value={newSub.DISTRICT} onChange={(e) => setNewSub({ ...newSub, DISTRICT: e.target.value })} placeholder="Huyện (DISTRICT)" className="p-2 border rounded" required />
          <input name="PCK_CODE" value={newSub.PCK_CODE} onChange={(e) => setNewSub({ ...newSub, PCK_CODE: e.target.value })} placeholder="Mã gói cước (PCK_CODE)" className="p-2 border rounded" />
          <input name="PCK_DATE" value={newSub.PCK_DATE} onChange={(e) => setNewSub({ ...newSub, PCK_DATE: e.target.value })} placeholder="Ngày đăng ký (PCK_DATE: YYYY-MM-DD)" type="date" className="p-2 border rounded" />
          <input name="PCK_CHARGE" value={newSub.PCK_CHARGE} onChange={(e) => setNewSub({ ...newSub, PCK_CHARGE: e.target.value })} placeholder="Phí gói (PCK_CHARGE)" type="number" className="p-2 border rounded" />
          <button type="submit" className="col-span-1 md:col-span-3 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Thêm</button>
        </form>
      </div>

      {/* Danh sách + Search */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-600">Danh Sách Thuê Bao</h3>
        <input
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Tìm số thuê bao (SUB_ID)"
          className="p-2 border rounded w-1/3"
        />
      </div>

      {/* Filters Row - Use label */}
      <div className="flex flex-wrap mb-4 gap-4">
        <select name="type" value={filters.type} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Hình thức (TYPE)</option>
          <option value="C">Trả trước (C)</option> {/* Hardcode vì chỉ 2 */}
          <option value="F">Trả sau (F)</option>
        </select>
        <select name="staType" value={filters.staType} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Loại hòa mạng (STA_TYPE)</option>
          {options.staTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select name="subType" value={filters.subType} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Loại thuê bao (SUB_TYPE)</option>
          {options.subTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select name="province" value={filters.province} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Tỉnh (PROVINCE)</option>
          {options.provinces.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select name="district" value={filters.district} onChange={handleFilterChange} className="p-2 border rounded" disabled={!filters.province}>
          <option value="">Huyện (DISTRICT)</option>
          {districtOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
        <button onClick={resetFilters} className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">Reset</button>
      </div>

      {/* Table */}
      {loading ? <p className="text-blue-600">Đang tải...</p> : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 text-left">Mã thuê bao</th>
                <th className="p-2 text-left">Hình thức</th>
                <th className="p-2 text-left">Loại hòa mạng</th>
                <th className="p-2 text-left">Ngày hòa mạng</th>
                <th className="p-2 text-left">Loại thuê bao</th>
                <th className="p-2 text-left">Tỉnh</th>
                <th className="p-2 text-left">Huyện</th>
                <th className="p-2 text-left">Mã gói cước</th>
                <th className="p-2 text-left">Ngày đăng ký</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(sub => (
                <tr key={sub._id} onClick={() => openDetails(sub)} className="cursor-pointer hover:bg-blue-50">
                  <td className="p-2">{sub.SUB_ID}</td>
                  <td className="p-2">{mapType(sub.TYPE)}</td>
                  <td className="p-2">{sub.fullStaType}</td>
                  <td className="p-2">{new Date(sub.STA_DATE).toLocaleDateString()}</td>
                  <td className="p-2">{sub.fullSubType}</td>
                  <td className="p-2">{sub.fullProvince}</td> {/* Use full */}
                  <td className="p-2">{sub.fullDistrict}</td>
                  <td className="p-2">{sub.PCK_CODE}</td>
                  <td className="p-2">{sub.PCK_DATE ? new Date(sub.PCK_DATE).toLocaleDateString() : ''}</td>
                  <td className="p-2">
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(sub._id); }} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pagination}

      {/* Export */}
      <button onClick={exportCSV} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Export CSV</button>

      {/* Breakdown (giữ nguyên) */}
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-blue-600">Báo Cáo Breakdown</h3>
        <div className="flex mb-4">
          <button onClick={() => setBreakdownTab('province-district')} className={`px-4 py-2 ${breakdownTab === 'province-district' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'} rounded-l`}>Tỉnh/Huyện</button>
          <button onClick={() => setBreakdownTab('type')} className={`px-4 py-2 ${breakdownTab === 'type' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>Hình thức</button>
          <button onClick={() => setBreakdownTab('sta_type')} className={`px-4 py-2 ${breakdownTab === 'sta_type' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>Loại Hòa Mạng</button>
          <button onClick={() => setBreakdownTab('sub_type')} className={`px-4 py-2 ${breakdownTab === 'sub_type' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'} rounded-r`}>Loại Thuê Bao</button>
        </div>
        <table className="w-full">
          <thead className="bg-blue-100">
            <tr><th className="p-2 text-left">Nhóm</th><th className="p-2 text-left">Số Lượng</th></tr>
          </thead>
          <tbody>
            {breakdownData.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50">
                <td className="p-2">{item._id}</td>
                <td className="p-2">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Full fields */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-3/4 md:w-1/2 overflow-y-auto max-h-80">
            <h3 className="text-lg font-bold mb-4 text-blue-600">{isEdit ? 'Chỉnh Sửa' : 'Chi Tiết'} Thuê Bao</h3>
            {isEdit ? (
              <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
                <label>Mã thuê bao:</label>
                <input name="SUB_ID" value={selectedSub.SUB_ID} onChange={handleSubChange} className="w-full p-2 border rounded mb-2" />
                <label>Hình thức (TYPE):</label>
                <input name="TYPE" value={selectedSub.TYPE} onChange={handleSubChange} className="w-full p-2 border rounded mb-2" /> {/* Will map on display */}
                <label>Loại hòa mạng (STA_TYPE):</label>
                <input name="STA_TYPE" value={selectedSub.STA_TYPE} onChange={handleSubChange} className="w-full p-2 border rounded mb-2" />
                <label>Ngày hòa mạng (STA_DATE):</label>
                <input name="STA_DATE" value={selectedSub.STA_DATE.slice(0,10)} onChange={handleSubChange} type="date" className="w-full p-2 border rounded mb-2" />
                <label>Loại thuê bao (SUB_TYPE):</label>
                <input name="SUB_TYPE" value={selectedSub.SUB_TYPE} onChange={handleSubChange} className="w-full p-2 border rounded mb-2" />
                <label>Ngày kết thúc (END_DATE):</label>
                <input name="END_DATE" value={selectedSub.END_DATE ? selectedSub.END_DATE.slice(0,10) : ''} onChange={handleSubChange} type="date" className="w-full p-2 border rounded mb-2" />
                <label>Tỉnh (PROVINCE):</label>
                <input name="PROVINCE" value={selectedSub.PROVINCE} onChange={handleSubChange} className="w-full p-2 border rounded mb-2" />
                <label>Huyện (DISTRICT):</label>
                <input name="DISTRICT" value={selectedSub.DISTRICT} onChange={handleSubChange} className="w-full p-2 border rounded mb-2" />
                <label>Mã gói cước (PCK_CODE):</label>
                <input name="PCK_CODE" value={selectedSub.PCK_CODE} onChange={handleSubChange} className="w-full p-2 border rounded mb-2" />
                <label>Ngày đăng ký (PCK_DATE):</label>
                <input name="PCK_DATE" value={selectedSub.PCK_DATE ? selectedSub.PCK_DATE.slice(0,10) : ''} onChange={handleSubChange} type="date" className="w-full p-2 border rounded mb-2" />
                <label>Phí gói (PCK_CHARGE):</label>
                <input name="PCK_CHARGE" value={selectedSub.PCK_CHARGE} onChange={handleSubChange} type="number" className="w-full p-2 border rounded mb-2" />
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                  <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded ml-2">Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                <p><strong>Mã thuê bao:</strong> {selectedSub.SUB_ID}</p>
                <p><strong>Hình thức:</strong> {mapType(selectedSub.TYPE)}</p>
                <p><strong>Loại hòa mạng:</strong> {selectedSub.fullStaType}</p>
                <p><strong>Ngày hòa mạng:</strong> {new Date(selectedSub.STA_DATE).toLocaleDateString()}</p>
                <p><strong>Loại thuê bao:</strong> {selectedSub.fullSubType}</p>
                <p><strong>Ngày kết thúc:</strong> {selectedSub.END_DATE ? new Date(selectedSub.END_DATE).toLocaleDateString() : ''}</p>
                <p><strong>Tỉnh:</strong> {selectedSub.fullProvince}</p>
                <p><strong>Huyện:</strong> {selectedSub.fullDistrict}</p>
                <p><strong>Mã gói cước:</strong> {selectedSub.PCK_CODE}</p>
                <p><strong>Ngày đăng ký:</strong> {selectedSub.PCK_DATE ? new Date(selectedSub.PCK_DATE).toLocaleDateString() : ''}</p>
                <p><strong>Phí gói:</strong> {selectedSub.PCK_CHARGE}</p>
                <div className="flex justify-end mt-4">
                  <button onClick={() => setIsEdit(true)} className="px-4 py-2 bg-blue-600 text-white rounded">Edit</button>
                  <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded ml-2">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriber;