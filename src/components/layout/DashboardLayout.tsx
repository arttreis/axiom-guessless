import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TopBar } from './TopBar';
import { CommandPalette } from '../CommandPalette';

export function DashboardLayout() {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div className="dashboard-root">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="navbar-mobile">
        <Navbar />
      </div>

      <main className="dashboard-main">
        <TopBar onOpenCmd={() => setCmdOpen(true)} />
        <Outlet />
      </main>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
