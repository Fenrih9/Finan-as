import React from 'react';
import { Screen } from '../types';
import { useData } from '../DataContext';
import { Footer } from '../components/Footer';
import { formatTime, formatDateShort } from '../utils/formatters';

interface NotificationsProps {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsProps> = ({ onBack }) => {
  const { notifications } = useData();



  return (
    <div className="flex flex-col h-full max-w-md mx-auto w-full pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight flex-1 text-center">Carteira</h1>
          {notifications.length > 0 && (
            <button className="flex items-center justify-end">
              <span className="text-primary text-sm font-bold tracking-wide hover:opacity-80 transition-opacity">Ler tudo</span>
            </button>
          )}
        </div>
      </header>

      {/* Feed Content */}
      <main className="flex flex-col w-full pt-2 flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 opacity-50 mt-10">
            <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
            <p className="text-sm font-medium">Nenhuma atividade recente</p>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider px-6 py-4">Atividades Recentes</h3>
            {notifications.map((note) => (
              <div key={note.id} className={`group relative mx-4 mb-3 flex items-start gap-4 rounded-xl p-4 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 hover:shadow-md transition-all cursor-pointer ${!note.read ? 'bg-white dark:bg-[#1e293b] border-l-4 border-primary' : 'bg-slate-50 dark:bg-[#161f29] opacity-80'}`}>
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${note.type === 'alert' ? 'bg-expense/10 text-expense' : note.type === 'success' ? 'bg-income/10 text-income' : 'bg-primary/10 text-primary'}`}>
                  <span className="material-symbols-outlined text-xl">
                    {note.type === 'alert' ? 'payments' : note.type === 'success' ? 'account_balance_wallet' : 'notifications'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between items-start">
                    <p className="text-slate-900 dark:text-white text-sm font-bold leading-tight">{note.title}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-medium">{formatTime(note.date)}</span>
                      {!note.read && <span className="flex size-2 rounded-full bg-primary"></span>}
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed mt-1">
                    {note.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">{formatDateShort(note.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Footer className="py-4 mt-auto" />
      </main>
    </div>
  );
};