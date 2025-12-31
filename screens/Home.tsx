import React, { useMemo } from 'react';
import { Screen } from '../types';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useTheme } from '../ThemeContext';
import { useData } from '../DataContext';
import { Footer } from '../components/Footer';
import { formatMoney } from '../utils/formatters';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
}

export const HomeScreen: React.FC<HomeProps> = ({ onNavigate }) => {
  const { isPrivacyMode, togglePrivacyMode } = useTheme();
  const { user, balance, income, expense, notifications, transactions } = useData();
  console.log('HomeScreen: balance =', balance);



  // Generate chart data for the full year (Jan-Dec) dynamically based on transactions
  const chartData = useMemo(() => {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthlyNet = new Array(12).fill(0);

    // Aggregate transactions by month
    transactions.forEach(t => {
      const d = new Date(t.date);
      const mIndex = d.getMonth();
      // Calculate net flow (Income - Expense)
      const val = t.type === 'income' ? t.amount : -t.amount;
      monthlyNet[mIndex] += val;
    });

    // Calculate cumulative balance evolution for the year
    let runningTotal = 0;
    return monthNames.map((name, index) => {
      runningTotal += monthlyNet[index];
      return { name, value: runningTotal };
    });
  }, [transactions]);

  const totalGrowth = useMemo(() => {
    if (transactions.length === 0) return 0;
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const initialIncome = sorted.find(t => t.type === 'income')?.amount || 0;
    if (initialIncome === 0) return 0;
    return ((balance / initialIncome) - 1) * 100;
  }, [transactions, balance]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-24 max-w-md mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user.avatar ? (
              <div
                className="size-10 rounded-full bg-cover bg-center border-2 border-primary"
                style={{ backgroundImage: `url('${user.avatar}')` }}
              />
            ) : (
              <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">person</span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 flex items-center justify-center bg-surface-dark rounded-full p-0.5 border border-background-dark">
              <span className="material-symbols-outlined text-[12px] text-primary filled">favorite</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Olá,</p>
            <h2 className="text-lg font-bold leading-tight">{user.name}</h2>
          </div>
        </div>
        <button
          onClick={() => onNavigate(Screen.NOTIFICATIONS)}
          className="relative flex size-10 items-center justify-center rounded-full bg-slate-200 dark:bg-surface-dark transition-colors hover:bg-slate-300 dark:hover:bg-[#233342]"
        >
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-expense border border-white dark:border-surface-dark"></span>
          )}
        </button>
      </header>

      {/* Hero Card - Glassmorphism Dark Gray */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900/40 dark:bg-black/40 backdrop-blur-xl p-6 shadow-2xl border border-white/10 text-white">
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-blue-500/10 blur-2xl"></div>

        {/* Corinthians Background Logo */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center opacity-15 pointer-events-none"
          style={{
            backgroundImage: "url('https://upload.wikimedia.org/wikipedia/en/5/5a/Sport_Club_Corinthians_Paulista_crest.svg')",
            backgroundSize: '65%'
          }}
        />

        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-100/80">Patrimônio Total</p>
            <button
              onClick={togglePrivacyMode}
              className="flex items-center justify-center rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-blue-100 text-[20px]">
                {isPrivacyMode ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          <h1 className={`font-display text-4xl font-bold tracking-tight mt-1 ${balance >= 0 ? 'text-[#38bdf8]' : 'text-expense'
            }`}>
            {isPrivacyMode ? (
              <span className="tracking-widest">R$ ••••••</span>
            ) : (
              formatMoney(balance)
            )}
          </h1>

          <div className="flex items-end justify-between mt-4">
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 w-fit backdrop-blur-sm">
              <span className={`material-symbols-outlined text-sm ${balance >= 0 ? 'text-[#38bdf8]' : 'text-expense'}`}>
                {balance >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              <span className={`text-xs font-semibold ${balance >= 0 ? 'text-[#38bdf8]' : 'text-expense'}`}>
                {isPrivacyMode ? '•••••' : (balance >= 0 ? '+ 0%' : '- 0%')}
              </span>
              <span className="text-xs text-blue-100/70">este mês</span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 backdrop-blur-sm border border-primary/20">
                <span className="material-symbols-outlined text-[10px] text-primary">history</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Total</span>
                <span className={`text-[10px] font-black ${totalGrowth >= 0 ? 'text-[#38bdf8]' : 'text-expense'}`}>
                  {isPrivacyMode ? '••%' : `${totalGrowth >= 0 ? '+' : ''}${totalGrowth.toFixed(1)}%`}
                </span>
              </div>
              <div className="h-6 w-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={totalGrowth >= 0 ? '#38bdf8' : '#ff6b6b'}
                      strokeWidth={1.5}
                      fill={totalGrowth >= 0 ? '#38bdf8' : '#ff6b6b'}
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-surface-dark p-3 text-center shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-income/10 text-income">
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Receitas</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {isPrivacyMode ? '•••••' : formatMoney(income)}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-surface-dark p-3 text-center shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-expense/10 text-expense">
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Despesas</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {isPrivacyMode ? '•••••' : formatMoney(expense)}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-surface-dark p-3 text-center shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Balanço</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {isPrivacyMode ? '•••••' : formatMoney(balance)}
          </p>
        </div>
      </section>

      {/* Chart Section */}
      <section className="rounded-2xl bg-white dark:bg-surface-dark p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Evolução do Patrimônio</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ano Atual</p>
          </div>
          <button onClick={() => onNavigate(Screen.ANALYTICS)} className="rounded-lg bg-slate-100 dark:bg-[#233342] px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300">
            Ver Detalhes
          </button>
        </div>

        {/* ADDED min-w-0 to prevent flex collapse causing 0 width error */}
        <div className="h-40 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#197fe6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#197fe6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a2632', borderColor: '#233342', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: '#197fe6', strokeWidth: 1, strokeDasharray: '4 4' }}
                formatter={(value: any) => isPrivacyMode ? '•••••' : `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#197fe6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate(Screen.TRANSACTION)}
          className="flex flex-col items-start gap-2 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-transform active:scale-95"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined">add</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">Nova Transação</span>
        </button>
        <button
          onClick={() => onNavigate(Screen.ANALYTICS)}
          className="flex flex-col items-start gap-2 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-transform active:scale-95"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <span className="material-symbols-outlined">pie_chart</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">Relatórios</span>
        </button>
      </section>

      <Footer />
    </div>
  );
};