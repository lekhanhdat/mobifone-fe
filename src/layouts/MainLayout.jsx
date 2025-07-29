import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const sidebarWidth = isOpen ? '256px' : '80px'; // w-64 = 256px, w-20 = 80px (Tailwind default)

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} sidebarWidth={sidebarWidth} />
      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} />
        <main 
          className={`transition-all duration-300 flex-1 pt-16 p-4 bg-[#F5F6FA]`} 
          style={{ marginLeft: sidebarWidth }} // Main responsive theo Sidebar
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;