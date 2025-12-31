import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Transaction, Notification, UserProfile, Category } from './types';
import { supabase } from './supabaseClient';

interface DataContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  transactions: Transaction[];
  notifications: Notification[];
  balance: number;
  income: number;
  expense: number;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateUser: (u: Partial<UserProfile & { wallpaper: string | null }>) => Promise<void>;
  updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  register: (name: string, email: string, pass: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  categories: Category[];
  addCategory: (name: string, icon: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  transactions: [],
  notifications: [],
  balance: 0,
  income: 0,
  expense: 0,
  addTransaction: async () => { },
  deleteTransaction: async () => { },
  updateUser: async () => { },
  updateTransaction: async () => { },
  login: async () => ({ error: null }),
  register: async () => ({ error: null }),
  logout: async () => { },
  categories: [],
  addCategory: async () => { },
  deleteCategory: async () => { },
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          name: session.user.user_metadata.full_name || 'Usuário',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url || null,
          wallpaper: session.user.user_metadata.wallpaper || null
        });
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          name: session.user.user_metadata.full_name || 'Usuário',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url || null,
          wallpaper: session.user.user_metadata.wallpaper || null
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // State for Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // State for Categories
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch data from Supabase
  const fetchTransactions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data.map((t: any) => ({
        ...t,
        date: new Date(t.date)
      })));
    }
  };

  const fetchCategories = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchCategories();
    } else {
      setTransactions([]);
      setCategories([]);
    }
  }, [isAuthenticated]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Auth Actions
  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    return { error };
  };

  const register = async (name: string, email: string, pass: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateUser = async (u: Partial<UserProfile & { wallpaper: string | null }>) => {
    // Update local state first
    setUser(prev => prev ? { ...prev, ...u } as UserProfile : null);

    // Update Supabase metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: u.name || user?.name,
        avatar_url: u.avatar || user?.avatar,
        wallpaper: u.hasOwnProperty('wallpaper') ? u.wallpaper : (user as any)?.wallpaper
      }
    });

    if (error) {
      console.error('Error updating user metadata:', error);
    }
  };

  // Data Mutations
  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: t.category,
        date: t.date.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }

    const newTransaction: Transaction = {
      ...data,
      date: new Date(data.date)
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Local Notification
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: t.type === 'expense' ? 'Despesa Registrada' : 'Receita Recebida',
      message: `${t.description} de R$ ${t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} foi adicionado(a).`,
      date: new Date(),
      read: false,
      type: t.type === 'expense' ? 'alert' : 'success'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const updateTransaction = async (id: string, t: Partial<Transaction>) => {
    const { error } = await supabase
      .from('transactions')
      .update({
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: t.category,
        date: t.date?.toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating transaction:', error);
      return;
    }

    setTransactions(prev => prev.map(item => item.id === id ? { ...item, ...t } as Transaction : item));
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      return;
    }

    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = async (name: string, icon: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name,
        icon,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      return;
    }

    setCategories(prev => [...prev, data]);
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return;
    }

    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Calculated values
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  return (
    <DataContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      transactions,
      notifications,
      balance,
      income,
      expense,
      addTransaction,
      deleteTransaction,
      updateUser,
      login,
      register,
      logout,
      categories,
      addCategory,
      deleteCategory
    }}>
      {children}
    </DataContext.Provider>
  );
};