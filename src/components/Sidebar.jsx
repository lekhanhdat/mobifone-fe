import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Mobifone.svg';

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-4">
      <div className="flex justify-center items-center mb-6">
        <img src={logo} alt="Mobifone" className="h-8 object-contain" />
      </div>     
      <ul className="space-y-4">
        <li><Link to="/" className="text-gray-700 hover:text-purple-600">Dashboard</Link></li>
        <li><Link to="/subscriber" className="text-gray-700 hover:text-purple-600">Subscriber</Link></li>
        <li><Link to="/package" className="text-gray-700 hover:text-purple-600">Package</Link></li>
        <li><span className="text-gray-700 hover:text-purple-600">Order Lists</span></li>
        <li><span className="text-gray-700 hover:text-purple-600">To-Do</span></li>        
        <li><span className="text-gray-700 hover:text-purple-600">Contact</span></li>
        <li><span className="text-gray-700 hover:text-purple-600">Invoice</span></li>
        <li><span className="text-gray-700 hover:text-purple-600">Profile</span></li>
        <li><span className="text-gray-700 hover:text-purple-600">Settings</span></li>
        <li><span className="text-gray-700 hover:text-purple-600">Logout</span></li>
      </ul>
    </aside>
  );
};

export default Sidebar;