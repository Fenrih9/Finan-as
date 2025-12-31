import React, { useState, useMemo, useRef } from 'react';
import { Screen } from '../types';
import { useData } from '../DataContext';
import { Footer } from '../components/Footer';

interface NewTransactionProps {
  onBack: () => void;
  initialTransaction?: any;
}

export const NewTransactionScreen: React.FC<NewTransactionProps> = ({ onBack, initialTransaction }) => {
  const { addTransaction, updateTransaction, categories } = useData();
  const dateInputRef = useRef<HTMLInputElement>(null);

  // States initialized from initialTransaction if present
  const [type, setType] = useState<'income' | 'expense'>(initialTransaction?.type || 'expense');
  const [amount, setAmount] = useState(initialTransaction ? String(initialTransaction.amount).replace('.', ',') : '');
  const [description, setDescription] = useState(initialTransaction?.description || '');
  const [category, setCategory] = useState(initialTransaction?.category || '');
  const [date, setDate] = useState<Date>(initialTransaction?.date ? new Date(initialTransaction.date) : new Date());

  // Handle Save
  const handleSave = async () => {
    if (!amount || !description) {
      return;
    }

    // Parse amount: support "50,00" -> 50.00
    const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));

    if (isNaN(numericAmount) || numericAmount <= 0) return;

    if (initialTransaction?.id) {
      await updateTransaction(initialTransaction.id, {
        description,
        amount: numericAmount,
        type,
        category: category || 'Geral',
        date: date,
      });
    } else {
      await addTransaction({
        description,
        amount: numericAmount,
        type,
        category: category || 'Geral',
        date: date,
      });
    }

    onBack();
  };

  // Date Logic
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split('-').map(Number);
      // Create date at noon (12:00) to avoid timezone/midnight edge cases when selecting past dates
      const newDate = new Date(y, m - 1, d, 12, 0, 0);
      setDate(newDate);
    }
  };

  const formatDateToInputValue = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateDisplay = useMemo(() => {
    const today = new Date();
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Check if Today
    if (d1.getTime() === d2.getTime()) return 'Hoje';

    // Check if Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const d3 = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    if (d1.getTime() === d3.getTime()) return 'Ontem';

    // Check if Tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const d4 = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    if (d1.getTime() === d4.getTime()) return 'Amanhã';

    return date.toLocaleDateString('pt-BR');
  }, [date]);

  const triggerDatePicker = () => {
    const input = dateInputRef.current;
    if (input) {
      // Try to open the picker programmatically (works in some browsers)
      // Cast to any to avoid TypeScript narrowing 'input' to never in the else block
      if ('showPicker' in (input as any)) {
        try {
          (input as any).showPicker();
        } catch (e) {
          // Fallback or ignore if not supported/allowed
          input.focus();
          input.click();
        }
      } else {
        input.focus();
        input.click();
      }
    }
  };

  const isExpense = type === 'expense';
  const activeColorClass = isExpense ? 'text-expense' : 'text-income';
  const activeBgClass = isExpense ? 'bg-expense' : 'bg-income';

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark max-w-md mx-auto w-full relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 pt-6 z-10 relative">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[28px]">close</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight text-center flex-1">
          {initialTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}
        </h1>
        <div className="w-10"></div>
      </header>

      {/* Tabs */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/50">
          {/* Receita Tab */}
          <button
            onClick={() => setType('income')}
            className="flex flex-col items-center justify-center flex-1 pb-3 pt-2 group relative"
          >
            <span className={`text-sm ${type === 'income' ? 'font-bold text-income' : 'font-medium text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} transition-colors`}>
              Receita
            </span>
            <div className={`absolute bottom-0 w-full h-[3px] rounded-t-full transition-all ${type === 'income' ? 'bg-income shadow-[0_-2px_8px_rgba(16,185,129,0.4)]' : 'bg-transparent'}`}></div>
          </button>

          {/* Despesa Tab */}
          <button
            onClick={() => setType('expense')}
            className="flex flex-col items-center justify-center flex-1 pb-3 pt-2 group relative"
          >
            <span className={`text-sm ${type === 'expense' ? 'font-bold text-expense' : 'font-medium text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} transition-colors`}>
              Despesa
            </span>
            <div className={`absolute bottom-0 w-full h-[3px] rounded-t-full transition-all ${type === 'expense' ? 'bg-expense shadow-[0_-2px_8px_rgba(255,107,107,0.4)]' : 'bg-transparent'}`}></div>
          </button>

          {/* Placeholders for Inv/Transf visual consistency, mapped to expense for now or disabled */}
          <button className="flex flex-col items-center justify-center flex-1 pb-3 pt-2 group relative opacity-50 cursor-not-allowed">
            <span className="text-sm font-medium text-slate-400 transition-colors">Inv.</span>
            <div className="absolute bottom-0 w-full h-[3px] bg-transparent rounded-t-full transition-all"></div>
          </button>

          <button className="flex flex-col items-center justify-center flex-1 pb-3 pt-2 group relative opacity-50 cursor-not-allowed">
            <span className="text-sm font-medium text-slate-400 transition-colors">Transf.</span>
            <div className="absolute bottom-0 w-full h-[3px] bg-transparent rounded-t-full transition-all"></div>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-0">
        {/* Hero Value Input */}
        <div className="flex flex-col items-center justify-center py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <label className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {isExpense ? 'Valor da Despesa' : 'Valor da Receita'}
          </label>
          <div className="relative flex items-center justify-center">
            <span className={`text-3xl sm:text-4xl font-bold mr-1 mb-1 ${activeColorClass}`}>R$</span>
            <input
              autoFocus
              className={`bg-transparent border-none p-0 text-center text-5xl sm:text-6xl font-extrabold focus:ring-0 w-full max-w-[300px] placeholder-slate-600 caret-current outline-none ${activeColorClass}`}
              inputMode="decimal"
              type="text"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-t-3xl shadow-soft p-6 pb-32 border-t border-slate-100 dark:border-slate-700/30 overflow-y-auto no-scrollbar">
          <div className="max-w-md mx-auto space-y-6">
            {/* Description Field */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Descrição</label>
              <div className="flex items-center bg-background-light dark:bg-background-dark/50 rounded-xl px-4 py-1 border border-transparent focus-within:border-primary/50 focus-within:bg-background-light dark:focus-within:bg-black/20 transition-all">
                <span className="material-symbols-outlined text-slate-400 mr-3">edit_note</span>
                <input
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder-slate-400/70 py-3 text-base font-medium outline-none"
                  placeholder={isExpense ? "Ex: Supermercado" : "Ex: Salário"}
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category selector */}
              <div className="group col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Categoria</label>
                <div className="flex items-center bg-background-light dark:bg-background-dark/50 rounded-xl px-4 py-1 border border-transparent focus-within:border-primary/50 transition-all">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-2 text-slate-500 dark:text-slate-300 shrink-0">
                    <span className="material-symbols-outlined text-lg">
                      {categories.find(c => c.name === category)?.icon || 'category'}
                    </span>
                  </div>
                  <select
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white py-3 text-base font-medium outline-none appearance-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" className="dark:bg-surface-dark">Selecione uma categoria</option>
                    <option value="Geral" className="dark:bg-surface-dark">Geral</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name} className="dark:bg-surface-dark">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined text-slate-400">expand_more</span>
                </div>
              </div>

              {/* Date Picker (Functional) */}
              <div className="group col-span-2 sm:col-span-1 relative">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Data</label>
                <div className="relative" onClick={triggerDatePicker}>
                  <div className="w-full flex items-center bg-background-light dark:bg-background-dark/50 rounded-xl px-4 py-3 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left cursor-pointer">
                    <span className="material-symbols-outlined text-slate-400 mr-3">calendar_today</span>
                    <span className="text-slate-800 dark:text-white font-medium flex-1 truncate">{dateDisplay}</span>
                  </div>
                  <input
                    ref={dateInputRef}
                    type="date"
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    value={formatDateToInputValue(date)}
                    onChange={handleDateChange}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </div>

            {/* Account Selector */}
            <div className="space-y-4 pt-2">
              <div className="group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Conta de Origem</label>
                <button className="w-full flex items-center justify-between bg-background-light dark:bg-background-dark/50 rounded-xl px-4 py-3 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center mr-3 text-purple-600 dark:text-purple-400">
                      <span className="material-symbols-outlined text-lg">account_balance</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-800 dark:text-white font-medium text-sm">Conta Principal</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-xl">expand_more</span>
                </button>
              </div>

              {/* Recurring Checkbox */}
              <div className="flex items-center justify-between bg-background-light dark:bg-background-dark/30 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined text-xl">update</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-800 dark:text-white">Repetir lançamento?</span>
                    <span className="text-xs text-slate-500">Fixa ou Parcelada</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </main>

      {/* Floating Action Button Area */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pb-8 pt-8 pointer-events-none max-w-md mx-auto right-0">
        <button
          onClick={handleSave}
          className={`pointer-events-auto w-full text-white font-bold text-lg py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${activeBgClass} hover:opacity-90`}
        >
          <span className="material-symbols-outlined">check</span>
          Salvar Lançamento
        </button>
      </div>
    </div>
  );
};