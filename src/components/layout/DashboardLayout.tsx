import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TopBar } from './TopBar';
import { CommandPalette } from '../CommandPalette';
import { usePosts } from '../../hooks/usePosts';

export function DashboardLayout() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const location = useLocation();
  const { posts } = usePosts();

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
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} posts={posts} />
    </div>
  );
}
