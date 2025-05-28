// components/UserContext.tsx
import React, { createContext, useState, useEffect } from 'react';

interface UserContextType {
  isLoggedIn: boolean;
  fullName: string | null;
  role: string | null; // Додаємо поле для ролі
  setLoggedIn: (loggedIn: boolean) => void;
  setFullName: (fullName: string | null) => void;
  setRole: (role: string | null) => void; // Додаємо функцію для встановлення ролі
}

export const UserContext = createContext<UserContextType>({
  isLoggedIn: false,
  fullName: null,
  role: null,
  setLoggedIn: () => {},
  setFullName: () => {},
  setRole: () => {},
});

const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000;

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Ініціалізуємо стан для ролі

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
      if (storedIsLoggedIn === 'true') {
        setIsLoggedIn(true);
      }
      const storedFullName = localStorage.getItem('fullName');
      if (storedFullName) {
        setFullName(storedFullName);
      }
      const storedRole = localStorage.getItem('role');
      if (storedRole) {
        setRole(storedRole);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', String(isLoggedIn));
      const expiry = Date.now() + TWELVE_HOURS_IN_MS;
      localStorage.setItem('isLoggedInExpiry', String(expiry));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fullName', fullName || '');
      const expiry = Date.now() + TWELVE_HOURS_IN_MS;
      localStorage.setItem('fullNameExpiry', String(expiry));
    }
  }, [fullName]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('role', role || '');
      const expiry = Date.now() + TWELVE_HOURS_IN_MS;
      localStorage.setItem('roleExpiry', String(expiry));
    }
  }, [role]);

  return (
    <UserContext.Provider value={{ isLoggedIn, fullName, role, setLoggedIn: setIsLoggedIn, setFullName, setRole }}>
      {children}
    </UserContext.Provider>
  );
};