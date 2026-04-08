import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  LogOut,
  GraduationCap,
  Menu,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { mockStudent } from '../utils/mockData';

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/book', label: 'Book Exam', icon: BookOpen },
  { to: '/student/bookings', label: 'My Bookings', icon: ClipboardList },
];

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          isActive
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
        }`
      }
    >
      <Icon size={18} strokeWidth={1.75} />
      <span>{label}</span>
    </NavLink>
  );
}

function Sidebar({ onNavClick, onLogout, initials }) {
  return (
    <aside className="flex flex-col h-full bg-slate-900 w-64 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/60">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 flex-shrink-0">
          <GraduationCap size={20} className="text-white" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm leading-tight">SMPS</p>
          <p className="text-slate-400 text-xs leading-tight">Exam System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Student Portal
        </p>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={onNavClick} />
        ))}
      </nav>

      {/* Student profile footer */}
      <div className="border-t border-slate-700/60 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {mockStudent.firstName} {mockStudent.lastName}
            </p>
            <p className="text-xs text-slate-400 truncate">{mockStudent.registrationNumber}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
        >
          <LogOut size={16} strokeWidth={1.75} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const initials = `${mockStudent.firstName[0]}${mockStudent.lastName[0]}`;

  const handleLogout = () => {
    // Will wire to AuthContext when backend is ready
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar initials={initials} onLogout={handleLogout} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50">
            <Sidebar
              initials={initials}
              onLogout={handleLogout}
              onNavClick={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 shadow-sm">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-slate-400">Student Portal</span>
            <ChevronRight size={14} className="text-slate-300" />
          </div>

          <div className="flex-1" />

          {/* Notification bell */}
          <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
          </button>

          {/* User chip */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-800 leading-tight">
                {mockStudent.firstName} {mockStudent.lastName}
              </p>
              <p className="text-xs text-slate-400">{mockStudent.registrationNumber}</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
