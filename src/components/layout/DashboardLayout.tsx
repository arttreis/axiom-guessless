import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function DashboardLayout() {
  return (
    <div className="dashboard-root">
      {/* Sidebar — desktop */}
      <div className="sidebar-container">
        <Sidebar />
      </div>

      {/* Navbar — mobile */}
      <div className="navbar-mobile">
        <Navbar />
      </div>

      {/* Conteúdo principal */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
