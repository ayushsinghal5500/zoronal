import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const THEME_QUERY = '(prefers-color-scheme: dark)';

const applyThemeClass = (isDarkMode) => {
  document.documentElement.classList.toggle('dark', isDarkMode);
};

const getPreferredTheme = () => window.matchMedia(THEME_QUERY).matches;

const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: getPreferredTheme(),
      toggleTheme: () => set((state) => {
        const nextMode = !state.isDarkMode;
        applyThemeClass(nextMode);
        return { isDarkMode: nextMode };
      }),
      initTheme: () => {
        applyThemeClass(useThemeStore.getState().isDarkMode);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
