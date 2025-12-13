import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BookingWizard } from './pages/public/BookingWizard';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ServicesPage } from './pages/admin/ServicesPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { authService } from './services/api';
import { Lock } from 'lucide-react';

// Paywall Component (Bloqueia acesso se trial expirado)
const PaywallScreen = () => (
  <div className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Período de Teste Expirado</h2>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Seus 3 dias de acesso gratuito acabaram. Para continuar gerenciando seus agendamentos, assine um de nossos planos.
      </p>
      
      <button className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-all shadow-lg mb-3">
        Assinar Agora (R$ 49,90/mês)
      </button>
      
      <button 
        onClick={() => { authService.logout(); window.location.href = '#/admin/login'; }}
        className="text-gray-400 text-sm hover:text-gray-600 underline"
      >
        Sair da conta
      </button>
    </div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Verifica se o trial expirou
  const trial = authService.getTrialStatus();
  if (!trial.active) {
    return (
        <>
            {children}
            <PaywallScreen />
        </>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<BookingWizard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/services" element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;