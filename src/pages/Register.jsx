import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/Mobifone.svg";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await instance.post('http://localhost:5000/api/auth/register', { email, username, password, fullName });
      alert('Đăng ký thành công! Hãy đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-center items-center mb-6">
            <img src={logo} alt="Mobifone" className="h-10 object-contain m-2" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center">Đăng ký</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">Điền đầy đủ các thông tin để tạo tài khoản mới</p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded bg-gray-100" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded bg-gray-100" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 border rounded bg-gray-100" required />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-gray-100 pr-10"
                required
            />
            <button
                type="button"
                onClick={togglePassword}
                className="absolute right-2 top-9 text-gray-500"
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Đăng ký</button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-4">
          Đã có tài khoản? <a href="/login" className="text-blue-500">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}

export default Register;