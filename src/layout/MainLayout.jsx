import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white">
        {/* Sidebar (sẽ thêm sau) */}
        <div className="p-4 font-bold text-xl">Dashboard</div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4">
          {/* Header (sẽ thêm sau) */}
          <h1 className="text-2xl font-bold">Mobifone Admin</h1>
        </header>
        <main className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
