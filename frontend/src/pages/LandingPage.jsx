import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ScanLine, ShieldCheck } from 'lucide-react';
import logo from '../assets/jkuat-logo.png';

const roles = [
  {
    icon: GraduationCap,
    title: 'Student',
    description: 'Register for supplementary exams, pay via M-Pesa and access your verification ticket.',
    path: '/login',
    accent: 'var(--primary)',
  },
  {
    icon: ScanLine,
    title: 'Invigilator',
    description: 'Scan student QR tickets at the exam venue to verify attendance.',
    path: '/invigilator/login',
    accent: '#1A5276',
  },
  {
    icon: ShieldCheck,
    title: 'Administrator',
    description: 'Manage exam units, students, invigilators, bookings and payment records.',
    path: '/admin/login',
    accent: '#4A235A',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', transition: 'background 0.2s' }}>

      {/* Header */}
      <div className="flex flex-col items-center mb-12">
        <img src={logo} alt="JKUAT" style={{ width: 72, height: 72, objectFit: 'contain', marginBottom: 16 }} />
        <h1 className="text-3xl font-bold text-center" style={{ color: 'var(--text-heading)', marginBottom: 8 }}>
          SMPS Exam System
        </h1>
        <p className="text-sm text-center max-w-sm" style={{ color: 'var(--text-muted)' }}>
          Jomo Kenyatta University of Agriculture and Technology
        </p>
        <p className="text-sm text-center max-w-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Select your role to continue
        </p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl">
        {roles.map(({ icon: Icon, title, description, path, accent }) => (
          <button key={title} onClick={() => navigate(path)}
            className="flex flex-col items-center text-center p-7 rounded-2xl transition-all duration-200 group"
            style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `${accent}15` }}>
              <Icon size={26} style={{ color: accent }} strokeWidth={1.75} />
            </div>
            <p className="text-base font-bold mb-2" style={{ color: 'var(--text-heading)' }}>{title}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
          </button>
        ))}
      </div>

      <p className="text-xs mt-10" style={{ color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} JKUAT · SMPS Supplementary Exam System
      </p>
    </div>
  );
}
