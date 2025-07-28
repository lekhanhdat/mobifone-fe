import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Subscriber from './pages/Subscriber';
import Package from './pages/Package';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subscriber" element={<Subscriber />} />
          <Route path="/package" element={<Package />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;