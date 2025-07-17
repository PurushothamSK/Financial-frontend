// src/context/AuthContext.jsx
import React, { createContext, useContext, useState,  useMemo, useCallback } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
 
const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('role')) || '');
const [token, setToken] = useState(() => localStorage.getItem('token') || '');
const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || '');
 

const signOut = useCallback(() => {
  setRole('');
  setToken('');
  setUser('');
  localStorage.removeItem('role');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}, []);



const setRoles = useCallback((role) =>{
  setRole(role);
  localStorage.setItem('role', JSON.stringify(role));
  }, []);

 const setTokens = useCallback((token) => {
  setToken(token);
  localStorage.setItem('token', token); // store token as string directly
}, []);

    const setNames = useCallback((user) => {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      }, []);

  


  const value = useMemo(() => ({role, setRole, setRoles, token, setTokens, user, setNames, signOut }), [role, setRole, setRoles, token, setTokens, user, setNames, signOut]); 

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
