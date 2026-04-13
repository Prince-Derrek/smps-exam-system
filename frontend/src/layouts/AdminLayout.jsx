import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, ClipboardList,
  CreditCard, UserCheck, LogOut, Menu, X, ChevronRight, Settings,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import logo from '../assets/jkuat-logo.png';

const BRAND = '#4A235A';
const GOLD = '#F5A623';

const navItems = [
  { to: '/admin/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/admin/exam-units',   label: 'Exam Units',   icon: BookOpen },
  { to: '/admin/students',     label: 'Students',     icon: Users },
  { to: '/admin/bookings',     label: 'Bookings',     icon: ClipboardList },
  { to: '/admin/payments',     label: 'Payments',     icon: CreditCard },
  { to: '/admin/invigilators', label: 'Invigilators', icon: UserCheck },
  { to: '/admin/settings',     label: 'Settings',     icon: Settings },
];

const pageTitles = {
  '/admin/dashboard':    'Dashboard',
  '/admin/exam-units':   'Exam Units',
  '/admin/students':     'Students',
  '/admin/bookings':     'Bookings',
  '/admin/payments':     'Payments',
  '/admin/invigilators': 'Invigilators',
  '/admin/settings':     'Settings',
};

function Sidebar({ initials, fullName, onLogout, onNavClick }) {
  return (
    <aside style={{ background: BRAND, width: 256 }} className="flex flex-col h-full flex-shrink-0">
      <div className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img src={logo} alt="JKUAT" className="w-10 h-10 object-contain" />
        <div>
          <p className="text-white font-bold text-sm leading-tight">SMPS</p>
          <p className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.35)' }}>Management</p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? '' : 'hover:bg-white/10'}`
            }
            style={({ isActive }) => isActive
              ? { background: GOLD, color: BRAND }
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
            style={{ background: GOLD, color: BRAND }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{fullName}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Administrator</p>
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

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const fullName = user?.fullName ?? 'Admin';
  const initials = fullName ? fullName[0].toUpperCase() : 'A';
  const pageTitle = pageTitles[location.pathname] ?? 'Admin';

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface)' }}>
      <div className="hidden lg:flex">
        <Sidebar initials={initials} fullName={fullName} onLogout={handleLogout} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50">
            <Sidebar initials={initials} fullName={fullName} onLogout={handleLogout}
              onNavClick={() => setSidebarOpen(false)} />
          </div>
          <button className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-white/10 text-white"
            onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0"
          style={{ background: 'var(--topbar-bg)', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            style={{ color: 'var(--text-muted)' }} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Admin Panel</span>
            <ChevronRight size={14} style={{ color: 'var(--border)' }} />
            <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>{pageTitle}</span>
          </div>
          <div className="flex-1" />
          <ThemeToggle />
          <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: '1px solid var(--border)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs"
              style={{ background: BRAND, color: GOLD }}>
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-heading)' }}>{fullName}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Administrator</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}
