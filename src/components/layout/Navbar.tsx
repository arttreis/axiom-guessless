import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="mobile-navbar">
        <Link to="/" className="sidebar-logo" style={{ fontSize: '1.25rem' }}>
          AXIOM
        </Link>
        <button
          className="hamburger-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menu"
        >
          ☰
        </button>
      </nav>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div
            className="drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
