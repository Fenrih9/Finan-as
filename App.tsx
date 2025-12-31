import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import { HomeScreen } from './screens/Home';
import { NewTransactionScreen } from './screens/NewTransaction';
import { NotificationsScreen } from './screens/Notifications';
import { ProfileScreen } from './screens/Profile';
import { AnalyticsScreen } from './screens/Analytics';
import { LoginScreen } from './screens/Login';
import { RegisterScreen } from './screens/Register';
import { BottomNav } from './components/BottomNav';
import { useData } from './DataContext';
import { useTheme } from './ThemeContext';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const { isAuthenticated, isLoading, user } = useData();
  const { wallpaper: themeWallpaper, setWallpaper } = useTheme();

  // Redirect to HOME when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen(Screen.HOME);
    }
  }, [isAuthenticated]);

  // Use persisted wallpaper if theme wallpaper is not manually set in current session
  const effectiveWallpaper = themeWallpaper || user?.wallpaper;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const renderAuthScreen = () => {
    switch (currentScreen) {
      case Screen.REGISTER:
        return <RegisterScreen onNavigate={setCurrentScreen} />;
      default:
        return <LoginScreen onNavigate={setCurrentScreen} />;
    }
  };

  const navigateToEdit = (t: any) => {
    setEditingTransaction(t);
    setCurrentScreen(Screen.TRANSACTION);
  };

  const handleBackFromTransaction = () => {
    setEditingTransaction(null);
    setCurrentScreen(Screen.HOME);
  };

  const renderAppScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case Screen.TRANSACTION:
        return <NewTransactionScreen
          onBack={handleBackFromTransaction}
          initialTransaction={editingTransaction}
        />;
      case Screen.NOTIFICATIONS:
        return <NotificationsScreen onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.PROFILE:
        return <ProfileScreen onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.ANALYTICS:
        return <AnalyticsScreen
          onBack={() => setCurrentScreen(Screen.HOME)}
          onEditTransaction={navigateToEdit}
        />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className={`relative min-h-screen text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-300 ${!effectiveWallpaper ? 'bg-background-light dark:bg-background-dark' : 'bg-background-light/90 dark:bg-background-dark/90'
      }`}>
      {/* Global Wallpaper Background */}
      {effectiveWallpaper && (
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-500"
          style={{ backgroundImage: `url('${effectiveWallpaper}')` }}
        />
      )}

      {/* Content */}
      <div className={`flex-1 flex flex-col ${effectiveWallpaper ? 'backdrop-blur-[2px]' : ''}`}>
        {!isAuthenticated ? renderAuthScreen() : renderAppScreen()}
      </div>

      {isAuthenticated && <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />}
    </div>
  );
};

export default App;