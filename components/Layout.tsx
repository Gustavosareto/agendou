import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Calendar, Settings, LogOut, Scissors, LayoutDashboard, Moon, Sun, AlertTriangle } from 'lucide-react';
import { authService } from '../services/api';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLogin = location.pathname === '/admin/login';
  
  // Theme State
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync theme on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center font-sans">
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2.5 text-brand-700">
              <div className="bg-brand-600 text-white p-1.5 rounded-lg shadow-sm">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-900">Agendou</span>
            </div>
            <Link 
              to="/admin" 
              className="text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-50"
            >
              Sou Profissional
            </Link>
          </div>
        </header>

        <main className="w-full max-w-3xl flex-1 p-4 md:p-8">
          {children}
        </main>

        <footer className="w-full py-8 text-center text-gray-400 text-xs border-t mt-auto bg-white">
          <p>&copy; {new Date().getFullYear()} Agendou. Tecnologia para negócios.</p>
        </footer>
      </div>
    );
  }

  // Login Page Full Screen
  if (isLogin) {
    return <>{children}</>;
  }

  // Trial Info
  const trial = authService.getTrialStatus();

  // Admin Layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 md:pb-0 transition-colors duration-300 font-sans">
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-brand-500 p-1.5 rounded-lg">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-wide text-gray-100 hidden md:inline">Painel Admin</span>
              <span className="font-bold text-lg tracking-wide text-gray-100 md:hidden">Admin</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center space-x-1">
                <NavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Visão Geral" current={location.pathname.includes('dashboard')} />
                <NavLink to="/admin/services" icon={<Scissors size={18} />} label="Serviços" current={location.pathname.includes('services')} />
                <NavLink to="/admin/settings" icon={<Settings size={18} />} label="Configurações" current={location.pathname.includes('settings')} />
              </div>
              
              <div className="h-6 w-px bg-slate-700 hidden md:block"></div>

              <div className="flex items-center gap-2">
                 <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Mudar Tema"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button 
                  onClick={handleLogout} 
                  className="hidden md:flex items-center gap-2 text-slate-300 hover:text-white px-3 py-2 rounded-md transition-colors text-sm font-medium hover:bg-slate-800"
                >
                  <LogOut size={16} /> Sair
                </button>
              </div>
            </div>
            
             {/* Mobile Header Logout Icon */}
             <button onClick={handleLogout} className="md:hidden text-slate-400 hover:text-white ml-2">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Trial Banner */}
      {trial.active && trial.daysLeft <= 3 && (
        <div className="bg-indigo-600 text-white text-xs font-medium text-center py-2 px-4 flex items-center justify-center gap-2">
           <AlertTriangle size={14} className="text-yellow-300" />
           <span>Você está no período de teste gratuito. Restam <strong>{trial.daysLeft} dias</strong>.</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex justify-around py-2 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <MobileNavLink to="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Agenda" current={location.pathname.includes('dashboard')} />
        <MobileNavLink to="/admin/services" icon={<Scissors size={20} />} label="Serviços" current={location.pathname.includes('services')} />
        <MobileNavLink to="/admin/settings" icon={<Settings size={20} />} label="Config" current={location.pathname.includes('settings')} />
      </div>
    </div>
  );
};

// Helper Components for Cleaner Code
const NavLink = ({ to, icon, label, current }: { to: string, icon: React.ReactNode, label: string, current: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
      current 
        ? 'bg-brand-600 text-white shadow-glow' 
        : 'text-slate-300 hover:text-white hover:bg-slate-800'
    }`}
  >
    {icon} {label}
  </Link>
);

const MobileNavLink = ({ to, icon, label, current }: { to: string, icon: React.ReactNode, label: string, current: boolean }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center gap-1 p-2 rounded-lg w-20 transition-colors ${
      current 
        ? 'text-brand-600 font-semibold bg-brand-50 dark:bg-slate-800' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
    }`}
  >
    {icon}
    <span className="text-[10px] uppercase tracking-wide">{label}</span>
  </Link>
);