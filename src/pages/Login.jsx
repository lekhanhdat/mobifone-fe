import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import instance from '../utils/axios';
import logo from "../assets/Mobifone.svg";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await instance.post('http://localhost:5000/api/auth/login', { identifier: email, password });
      localStorage.setItem('token', res.data.token);  // Save JWT token
      navigate('/');  // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  const [showPassword, setShowPassword] = useState(false);  // State clean cho toggle
  const togglePassword = () => setShowPassword(!showPassword);  // Function gọn

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-center items-center mb-6">
            <img src={logo} alt="Mobifone" className="h-10 object-contain m-2" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center">Đăng nhập</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Điền thông tin tài khoản để đăng nhập
        </p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email / tên người dùng</label>
            <input
              type="text"
              name="identifier"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm mb-1">Mật khẩu</label>
            <input
                type={showPassword ? 'text' : 'password'}  // Toggle type clean
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-gray-100 pr-10"  // pr-10 để chỗ icon
                required
            />
            <button
                type="button"  // Không submit form
                onClick={togglePassword}  // Toggle on click
                className="absolute right-2 top-9 text-gray-500"  // Position clean, top-9 match label+input height
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />} 
            </button>
            <a href="#" className="text-blue-500 text-xs float-right mt-2">Quên mật khẩu?</a>
          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mr-2"
            />
            <label className="text-gray-700 text-sm">Nhớ mật khẩu</label>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Đăng nhập
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-4">
          Chưa có tài khoản? <a href="/register" className="text-blue-500">Tạo tài khoản</a>
        </p>
      </div>
    </div>
  );
}

export default Login;