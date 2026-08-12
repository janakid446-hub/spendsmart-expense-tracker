import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        setStoredValue(initialValue);
      } else {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Corrupted localStorage key "${key}", resetting to default.`, error);
      setStoredValue(initialValue);
      try {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      } catch {
        /* ignore */
      }
    }
    setIsHydrated(true);
  }, [key]);

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const nextValue = typeof value === 'function' ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch (error) {
          console.warn(`Failed to save localStorage key "${key}"`, error);
        }
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue, isHydrated];
}
