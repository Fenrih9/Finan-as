import React from 'react';
import { Screen, NavigationProps } from '../types';

export const BottomNav: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  // If we are on the transaction screen (which acts like a modal), we typically don't show the bottom nav,
  // or it might cover it. For this design, let's hide it if on Transaction screen to give full focus.
  if (currentScreen === Screen.TRANSACTION) return null;

  const navItems = [
    { id: Screen.HOME, icon: 'home', label: 'Início' },
    { id: Screen.ANALYTICS, icon: 'analytics', label: 'Análises' }, // Using 'analytics' or 'pie_chart' based on preference
    { id: Screen.TRANSACTION, icon: 'add', label: '', isFab: true },
    { id: Screen.NOTIFICATIONS, icon: 'account_balance_wallet', label: 'Carteira' }, // Mapping 'Carteira' to Notifications for demo flow or keep standard
    { id: Screen.PROFILE, icon: 'person', label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#111921]/95 backdrop-blur-lg pb-safe">
      <div className="flex items-center justify-around px-2 pt-2 pb-5 max-w-md mx-auto">
        {navItems.map((item) => {
          if (item.isFab) {
            return (
              <div key={item.id} className="relative -top-6">
                <button
                  onClick={() => onNavigate(item.id)}
                  className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition-transform hover:scale-105 active:scale-95 border-4 border-white dark:border-background-dark"
                >
                  <span className="material-symbols-outlined text-3xl">add</span>
                </button>
              </div>
            );
          }

          const isActive = currentScreen === item.id;
          // Specialized mapping for "Carteira" placeholder if needed, currently mapped to Notifications for the sake of the demo slots
          // The prompt shows "Carteira" icon as wallet, but I'll link it to a placeholder or stay on current for now if not implemented.
          // Let's actually link "Carteira" to Analytics just for flow, or keep it inactive.
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 p-2 transition-colors group ${
                isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              <span 
                className={`material-symbols-outlined text-2xl group-hover:-translate-y-0.5 transition-transform ${isActive ? 'filled' : ''}`}
              >
                {item.icon}
              </span>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};