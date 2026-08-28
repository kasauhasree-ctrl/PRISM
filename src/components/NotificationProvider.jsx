import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [list, setList] = useState([]);

  const add = useCallback((note) => {
    const id = `n-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const item = { id, seen: false, timestamp: new Date().toISOString(), ...note };
    setList(prev => [item, ...prev].slice(0, 50));
    return id;
  }, []);

  const dismiss = useCallback((id) => setList(prev => prev.filter(n => n.id !== id)), []);
  const markSeen = useCallback((id) => setList(prev => prev.map(n => n.id === id ? { ...n, seen: true } : n)), []);

  const unreadCount = list.filter(n => !n.seen).length;

  return (
    <NotificationContext.Provider value={{ list, add, dismiss, markSeen, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
