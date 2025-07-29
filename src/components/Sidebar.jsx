import React from 'react';
import { NavLink } from 'react-router-dom'; // Dùng NavLink cho active highlight
import logo from '../assets/Mobifone.svg';
import { BsCircle, BsHeart, BsInbox, BsListUl, BsClipboardCheck, BsCalendar, BsChatDots, BsReceipt, BsPerson, BsGear, BsBoxArrowRight } from 'react-icons/bs'; // Icons match Figma (thay nếu cần)

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`fixed top-0 left-0 h-screen bg-white shadow-lg p-4 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20 overflow-hidden'}`}>
      <div className="flex justify-center items-center mb-6">
        <img src={logo} alt="Mobifone" className="h-6 object-contain" />
      </div>
      <ul className="space-y-4">
        <li>
          <NavLink to="/" className={({ isActive }) => `flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded p-2 ${isActive ? 'text-blue-600 bg-blue-100' : ''}`}>
            <BsCircle className="mr-3 text-xl flex-shrink-0" />
            {isOpen && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/subscriber" className={({ isActive }) => `flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded p-2 ${isActive ? 'text-blue-600 bg-blue-100' : ''}`}>
            <BsHeart className="mr-3 text-xl flex-shrink-0" /> {/* Icon cho Subscriber, thay nếu cần */}
            {isOpen && <span>Subscriber</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/package" className={({ isActive }) => `flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded p-2 ${isActive ? 'text-blue-600 bg-blue-100' : ''}`}>
            <BsInbox className="mr-3 text-xl flex-shrink-0" /> {/* Icon cho Package */}
            {isOpen && <span>Package</span>}
          </NavLink>
        </li>
        <li className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded p-2 cursor-pointer">
          <BsListUl className="mr-3 text-xl flex-shrink-0" />
          {isOpen && <span>Order Lists</span>}
        </li>
        <li className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded p-2 cursor-pointer">
          <BsClipboardCheck className="mr-3 text-xl flex-shrink-0" />
          {isOpen && <span>To-Do</span>}
        </li>
        <li className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded p-2 cursor-pointer">
          <BsChatDots className="mr-3 text-xl flex-shrink-0" />
          {isOpen && <span>Contact</span>}
        </li>
        <li className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded p-2 cursor-pointer">
          <BsReceipt className="mr-3 text-xl flex-shrink-0" />
          {isOpen && <span>Invoice</span>}
        </li>
        <li className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded p-2 cursor-pointer">
          <BsPerson className="mr-3 text-xl flex-shrink-0" />
          {isOpen && <span>Profile</span>}
        </li>
        <li className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded p-2 cursor-pointer">
          <BsGear className="mr-3 text-xl flex-shrink-0" />
          {isOpen && <span>Settings</span>}
        </li>
        <li className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded p-2 cursor-pointer">
          <BsBoxArrowRight className="mr-3 text-xl flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;