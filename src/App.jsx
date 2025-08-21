import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; 
import Dashboard from './pages/Dashboard';
import Subscriber from './pages/Subscriber';
import Package from './pages/Package';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute'; 

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
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;