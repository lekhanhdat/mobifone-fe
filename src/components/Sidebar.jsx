import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Mobifone.svg";
import { useNavigate } from 'react-router-dom';
import {
  BsCircle,
  BsHeart,
  BsInbox,
  BsListUl,
  BsClipboardCheck,
  BsChatDots,
  BsReceipt,
  BsPerson,
  BsGear,
  BsBoxArrowRight,
} from "react-icons/bs";

const Sidebar = ({ isOpen }) => {
  const itemClass = (isActive = false) => `
    flex items-center h-12 text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded cursor-pointer transition-all duration-300
    ${isActive ? "text-blue-600 bg-blue-100" : ""}
    ${isOpen ? "w-full justify-start px-4" : "w-16 justify-center"}
  `;

  const menuItems = [
    { label: "Dashboard", icon: BsCircle, path: "/" },
    { label: "Subscriber", icon: BsHeart, path: "/subscriber" },
    { label: "Package", icon: BsInbox, path: "/package" },
    { label: "Order Lists", icon: BsListUl, path: "/orders" },
    { label: "To-Do", icon: BsClipboardCheck, path: "/todo" },
    { label: "Contact", icon: BsChatDots, path: "/contact" },
    { label: "Invoice", icon: BsReceipt, path: "/invoice" },
    { label: "Profile", icon: BsPerson, path: "/profile" },
    { label: "Settings", icon: BsGear, path: "/settings" },
    { label: "Logout", icon: BsBoxArrowRight, path: "/logout" }, // sau này logic xong chuyển path thành #
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');  // Redirect to login
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 p-4 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="flex justify-center items-center mb-6">
        <img src={logo} alt="Mobifone" className="h-6 object-contain m-3" />
      </div>

      {/* Menu */}
      <ul className="space-y-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.label === "Logout" ? (
              <button
                onClick={handleLogout}  // Click logout
                className={itemClass(false)}  // Style giống NavLink, no active
              >
                <span className="flex items-center justify-center w-8 h-8">
                  <item.icon size={20} />
                </span>
                <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  {item.label}
                </span>
              </button>
            ) : (
              <NavLink to={item.path} className={({ isActive }) => itemClass(isActive)}>
                <span className="flex items-center justify-center w-8 h-8">
                  <item.icon size={20} />
                </span>
                <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  {item.label}
                </span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
