import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [transactions, setTransactions, transactionsHydrated] = useLocalStorage(
    STORAGE_KEYS.TRANSACTIONS,
    []
  );
  const [budgets, setBudgets, budgetsHydrated] = useLocalStorage(
    STORAGE_KEYS.BUDGETS,
    {}
  );
  const [theme, setTheme, themeHydrated] = useLocalStorage(
    STORAGE_KEYS.THEME,
    'light'
  );
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isHydrated = transactionsHydrated && budgetsHydrated && themeHydrated;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  const addTransaction = useCallback(
    (transaction) => {
      const newTx = { ...transaction, id: uuidv4() };
      setTransactions((prev) => [...prev, newTx]);
      return newTx;
    },
    [setTransactions]
  );

  const updateTransaction = useCallback(
    (id, updates) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    (id) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setDeleteTarget(null);
    },
    [setTransactions]
  );

  const setBudgetForCategory = useCallback(
    (monthKey, category, amount) => {
      setBudgets((prev) => ({
        ...prev,
        [monthKey]: {
          ...(prev[monthKey] || {}),
          [category]: Number(amount) || 0,
        },
      }));
    },
    [setBudgets]
  );

  const value = useMemo(
    () => ({
      transactions,
      budgets,
      theme,
      isHydrated,
      isDark: theme === 'dark',
      deleteTarget,
      setDeleteTarget,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setBudgetForCategory,
      toggleTheme,
      getTransactionById: (id) => transactions.find((t) => t.id === id),
    }),
    [
      transactions,
      budgets,
      theme,
      isHydrated,
      deleteTarget,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setBudgetForCategory,
      toggleTheme,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
