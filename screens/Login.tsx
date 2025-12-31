import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { useData } from '../DataContext';
import { useTheme } from '../ThemeContext';

interface LoginProps {
  onNavigate: (screen: Screen) => void;
}

export const LoginScreen: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useData();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('login_email');
    const savedPassword = localStorage.getItem('login_password');
    const savedSaveInfo = localStorage.getItem('login_save_info');

    if (savedSaveInfo === 'true') {
      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) setPassword(savedPassword);
      setSaveInfo(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email && password) {
      setLoading(true);
      const { error: loginError } = await login(email, password);
      if (loginError) {
        setError(loginError.message);
        setLoading(false);
      } else {
        // Handle persistence
        if (saveInfo) {
          localStorage.setItem('login_email', email);
          localStorage.setItem('login_password', password);
          localStorage.setItem('login_save_info', 'true');
        } else {
          localStorage.removeItem('login_email');
          localStorage.removeItem('login_password');
          localStorage.removeItem('login_save_info');
        }
      }
      // If no error, DataContext listener will handle the transition
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 max-w-md mx-auto w-full animate-in fade-in duration-500">

      {/* Logo / Brand */}
      <div className="mb-10 text-center">
        <div className={`mx-auto mb-4 flex size-20 items-center justify-center rounded-3xl ${theme === 'light' ? 'bg-highlight/20 text-highlight' : 'bg-primary/20 text-primary'} shadow-lg`}>
          <span className="material-symbols-outlined text-[40px]">account_balance_wallet</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Bem-vindo</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Faça login para gerenciar suas finanças</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 w-full rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800/50">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Email</label>
          <div className="flex items-center rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700/50 p-3 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-slate-400 mr-2">mail</span>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Senha</label>
          <div className="flex items-center rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700/50 p-3 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <span className="material-symbols-outlined text-slate-400 mr-2">lock</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="******"
              className="w-full bg-transparent border-none p-0 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center justify-center p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
              />
              <div className={`size-4 rounded border-2 ${saveInfo ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'} transition-all flex items-center justify-center`}>
                {saveInfo && <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>}
              </div>
            </div>
            <span className="ml-2 text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              Salvar dados
            </span>
          </label>
          <button type="button" className="text-xs font-bold text-primary hover:underline">Esqueceu a senha?</button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Não tem uma conta?{' '}
          <button
            onClick={() => onNavigate(Screen.REGISTER)}
            className={`font-bold hover:underline ${theme === 'light' ? 'text-highlight' : 'text-primary'}`}
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};