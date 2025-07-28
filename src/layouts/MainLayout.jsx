import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ marginLeft: '200px', padding: '20px', flex: 1 }}>
          <Outlet />  {/* Nội dung trang sẽ render ở đây */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;