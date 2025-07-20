import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/dashboard";
import Subscribers from "./pages/subscribers";
import Packages from "./pages/packages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="packages" element={<Packages />} />
      </Route>
    </Routes>
  );
}
