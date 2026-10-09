import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileCheck2,
  FileText,
  GitBranch,
  LogOut,
  Sparkles,
  ExternalLink,
  ClipboardList,
} from 'lucide-react';
import { Logo } from '../../ui/Logo';
import { useDemoAuth } from '../../../context/DemoAuthContext';
import { ToastContainer } from '../../ui/Toast';
import type { ToastMessage } from '../../../types/auth';

export const AuditorLayout: React.FC = () => {
  const { session, logout } = useDemoAuth();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    {
      to: '/auditor/dashboard',
      label: 'Assurance Overview',
      icon: ShieldCheck,
      end: true,
    },
    {
      to: '/auditor/evidence',
      label: 'Evidence Vault & Custody',
      icon: FileCheck2,
    },
    {
      to: '/auditor/lineage',
      label: 'Data Lineage & Formulas',
      icon: GitBranch,
    },
    {
      to: '/auditor/assurance-statement',
      label: 'Independent Assurance Opinion',
      icon: ClipboardList,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-purple-900 selection:text-purple-100">
      {/* Top Demo Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-purple-800/40 px-4 py-1.5 text-xs flex items-center justify-between text-purple-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="font-semibold text-purple-100">
            Demo Auditor &amp; Assurer Portal
          </span>
          <span className="hidden sm:inline text-purple-300">
            &bull; Logged in as: {session?.user?.name || 'Sanjay Deshmukh (Lead Assurer)'} ({session?.user?.email || 'auditor@meil.in'})
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-purple-300">
          <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-700/50">
            ISAE 3000 / AA1000AS Core Scope
          </span>
        </div>
      </div>

      {/* Main Top Navigation Bar */}
      <header className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3.5">
            <Logo className="w-8 h-8" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  MEIL ESG NEXUS
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Auditor &amp; Assurer
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Third-Party Assurance &amp; SEBI BRSR Core Verification
              </p>
            </div>
          </div>

          {/* Right User & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">
                {session?.user?.name || 'Sanjay Deshmukh'}
              </span>
              <span className="text-[11px] text-slate-400">
                Deloitte Touche Tohmatsu India LLP
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-200 text-xs font-bold">
              SD
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Sign out of Auditor Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Auditor Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet context={{ addToast }} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        MEIL ESG Nexus Assurance Gateway &bull; Compliant with SEBI BRSR Core Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122 &bull; Restricted external auditor access
      </footer>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
