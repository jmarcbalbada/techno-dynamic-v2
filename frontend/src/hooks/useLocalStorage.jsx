import { useState } from 'react';

export const useLocalStorage = (key, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (e) {
      return defaultValue;
    }
  });

  const setValue = (value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
    setStoredValue(value);
  };
  return [storedValue, setValue];
};
