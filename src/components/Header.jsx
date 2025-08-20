import React from 'react';
import { FiMenu } from 'react-icons/fi'; // Hamburger
import { BsSearch, BsChevronDown, BsBell } from 'react-icons/bs'; // Thay svg bằng icon đồng bộ
import user from '../assets/user.svg'; // Giữ user svg
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsBoxArrowRight } from 'react-icons/bs';  // Icon logout clean

const Header = ({ toggleSidebar, sidebarWidth }) => { 
  const [fullName, setFullName] = useState('');  // State clean cho tên user
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFullName(user.fullName || 'User');  // Load fullName, fallback nếu null
    }
  }, []);  // Run once on mount

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');  // Redirect clean
  };

  return (
    <header 
      className="fixed top-0 bg-white border-r border-gray-200 p-4 flex items-center justify-between z-10 transition-all duration-300"
      style={{ left: sidebarWidth, right: 0 }} // Responsive theo Sidebar width
    >
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-gray-700 hover:text-blue-600">
          <FiMenu className="text-2xl" />
        </button>
        <div className="relative flex items-center">
          <div className="relative w-64">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" /> {/* Thay svg */}
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="text-gray-700 mr-1">Tiếng Việt</span>
          <BsChevronDown className="text-gray-700 text-sm" /> {/* Thay svg */}
        </div>
        <div className="relative">
          <BsBell className="text-blue-500 text-xl" /> {/* Thay emoji bằng icon */}
          <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
        </div>
        <div className="flex items-center">  
          <img src={user} alt="User" className="w-8 h-8 rounded-full mr-2" />
          <div className="mr-4">
            <span className="font-bold">{fullName}</span>  
            <span className="text-gray-500 block text-sm">Admin</span>
          </div>
          <BsBoxArrowRight className="text-gray-700 text-xl cursor-pointer" onClick={handleLogout}/>  
        </div>
      </div>
    </header>
  );
};

export default Header;