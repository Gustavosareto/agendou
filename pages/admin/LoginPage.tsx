import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { Scissors, Check, UserPlus, LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [name, setName] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        // Register Logic
        await authService.register(name, email, password);
        navigate('/admin/dashboard');
      } else {
        // Login Logic
        await authService.login(email, password);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(isRegister ? 'Erro ao criar conta. Tente novamente.' : 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      {/* Ambient Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-[400px] p-6">
        {/* Glass Card */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
          
          {/* Avatar / Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-brand-500 to-transparent p-[1px]">
                <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center relative overflow-hidden group">
                     {/* Glow effect inside avatar */}
                     <div className="absolute inset-0 bg-brand-500/20 blur-xl group-hover:bg-brand-500/30 transition-all"></div>
                    <Scissors className="text-white w-8 h-8 relative z-10" />
                </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">{isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}</h2>
            <p className="text-slate-400 text-xs mt-1">
              {isRegister ? 'Comece seus 3 dias grátis agora.' : 'Faça login para gerenciar seu negócio.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            
            {isRegister && (
               <div className="space-y-1.5 animate-fade-in">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome da Loja</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-600 font-medium"
                  placeholder="Minha Barbearia"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required={isRegister}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <input 
                type="email" 
                className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-600 font-medium"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Senha</label>
              <input 
                type="password" 
                className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-600 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {!isRegister && (
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <div className="relative flex items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-3.5 h-3.5 border border-slate-600 rounded bg-slate-800/50 peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-colors"></div>
                      <Check size={9} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                  <span className="text-slate-400 text-xs group-hover:text-slate-300 transition-colors">Lembrar-me</span>
                </label>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-xs text-center bg-red-500/10 py-2.5 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-slate-900 font-bold py-3.5 rounded-xl hover:bg-brand-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 tracking-widest uppercase text-xs flex items-center justify-center gap-2"
            >
              {loading ? 'Carregando...' : (isRegister ? 'Criar Conta Grátis' : 'Entrar')}
            </button>
          </form>

          <div className="mt-6 text-center">
             <button 
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-brand-400 hover:text-brand-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2 w-full"
             >
                {isRegister ? (
                  <>Já tem uma conta? <LogIn size={14}/> Entrar</>
                ) : (
                  <>Novo por aqui? <UserPlus size={14}/> Crie sua conta grátis</>
                )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};