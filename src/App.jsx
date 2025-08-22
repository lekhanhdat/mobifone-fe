import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; 
import Dashboard from './pages/Dashboard';
import Subscriber from './pages/Subscriber';
import Package from './pages/Package';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute'; 
import ComingSoon from './pages/Comingsoon';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subscriber" element={<Subscriber />} />
            <Route path="/package" element={<Package />} />
            {/* All to ComingSoon */}
            <Route path="/orders" element={<ComingSoon />} />
            <Route path="/todo" element={<ComingSoon />} />
            <Route path="/contact" element={<ComingSoon />} />
            <Route path="/invoice" element={<ComingSoon />} />
            <Route path="/profile" element={<ComingSoon />} />
            <Route path="/settings" element={<ComingSoon />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;