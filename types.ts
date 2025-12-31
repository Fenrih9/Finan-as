export enum Screen {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  HOME = 'HOME',
  TRANSACTION = 'TRANSACTION',
  NOTIFICATIONS = 'NOTIFICATIONS',
  PROFILE = 'PROFILE',
  ANALYTICS = 'ANALYTICS',
}

export interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'alert' | 'info' | 'success' | 'warning';
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string | null;
  wallpaper: string | null;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}