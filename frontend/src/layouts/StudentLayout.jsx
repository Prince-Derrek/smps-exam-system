import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, ClipboardList, LogOut,
  Menu, X, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import logo from '../assets/jkuat-logo.png';

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/student/book',      label: 'Book Exam',   icon: BookOpen },
  { to: '/student/bookings',  label: 'My Bookings', icon: ClipboardList },
];

const pageTitles = {
  '/student/dashboard': 'Dashboard',
  '/student/book':      'Book an Exam',
  '/student/bookings':  'My Bookings',
};

function Sidebar({ initials, firstName, registrationNumber, onLogout, onNavClick }) {
  return (
    <aside style={{ background: 'var(--primary)', width: 256 }}
      className="flex flex-col h-full flex-shrink-0">

      <div className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img src={logo} alt="JKUAT" className="w-10 h-10 object-contain" />
        <div>
          <p className="text-white font-bold text-sm leading-tight">SMPS</p>
          <p className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>Exam System</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.35)' }}>Student Portal</p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? '' : 'hover:bg-white/10'}`
            }
            style={({ isActive }) => isActive
              ? { background: 'var(--gold)', color: 'var(--primary)' }
              : { color: 'rgba(255,255,255,0.7)' }
            }>
            <Icon size={17} strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs"
            style={{ background: 'var(--gold)', color: 'var(--primary)' }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{firstName}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{registrationNumber}</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/10"
          style={{ color: 'rgba(255,255,255,0.6)' }}>
          <LogOut size={15} strokeWidth={1.75} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const firstName = user?.firstName ?? 'Student';
  const registrationNumber = user?.registrationNumber ?? '';
  const initials = firstName ? firstName[0].toUpperCase() : 'S';
  const pageTitle = pageTitles[location.pathname] ?? 'Portal';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface)' }}>

      <div className="hidden lg:flex">
        <Sidebar initials={initials} firstName={firstName}
          registrationNumber={registrationNumber} onLogout={handleLogout} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50">
            <Sidebar initials={initials} firstName={firstName}
              registrationNumber={registrationNumber} onLogout={handleLogout}
              onNavClick={() => setSidebarOpen(false)} />
          </div>
          <button className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-white/10 text-white"
            onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white flex items-center px-4 lg:px-6 gap-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

          <button className="lg:hidden p-2 rounded-lg transition-colors hover:bg-slate-100"
            style={{ color: 'var(--text-muted)' }} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Student Portal</span>
            <ChevronRight size={14} style={{ color: 'var(--border)' }} />
            <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>{pageTitle}</span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: '1px solid var(--border)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs"
              style={{ background: 'var(--primary)', color: 'var(--gold)' }}>
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-heading)' }}>
                {firstName}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{registrationNumber}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
