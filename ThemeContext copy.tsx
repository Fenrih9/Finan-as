import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  wallpaper: string | null;
  setWallpaper: (url: string | null) => void;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  wallpaper: null,
  setWallpaper: () => {},
  isPrivacyMode: false,
  togglePrivacyMode: () => {},
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Wallpaper Logic
  const [wallpaper, setWallpaperState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_wallpaper');
    }
    return null;
  });

  const setWallpaper = (url: string | null) => {
    setWallpaperState(url);
    if (url) {
      localStorage.setItem('app_wallpaper', url);
    } else {
      localStorage.removeItem('app_wallpaper');
    }
  };

  // Privacy Logic
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_privacy_mode') === 'true';
    }
    return false;
  });

  const togglePrivacyMode = () => {
    setIsPrivacyMode((prev) => {
      const newValue = !prev;
      localStorage.setItem('app_privacy_mode', String(newValue));
      return newValue;
    });
  };

  // Theme (Dark/Light) Logic
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_theme');
      return (stored === 'light' || stored === 'dark') ? stored : 'dark';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
        const newTheme = prev === 'dark' ? 'light' : 'dark';
        localStorage.setItem('app_theme', newTheme);
        return newTheme;
    });
  };

  // Apply theme class to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ wallpaper, setWallpaper, isPrivacyMode, togglePrivacyMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};