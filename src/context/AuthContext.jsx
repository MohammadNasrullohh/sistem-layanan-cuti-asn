import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch employees list
  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const data = await res.json();
      setEmployees(data);
      
      // Check saved login session
      const savedId = localStorage.getItem('lawethub_user_id');
      const isLoggedIn = localStorage.getItem('lawethub_is_logged_in') === 'true';
      
      if (savedId && isLoggedIn) {
        const found = data.find(e => e.id === savedId);
        if (found) {
          setCurrentUser(found);
          setIsAuthenticated(true);
        }
      } else if (data.length > 0) {
        // Default to Ahmad Fauzi (PNS) in demo mode
        setCurrentUser(data.find(e => e.id === 'emp-pns-1') || data[0]);
        setIsAuthenticated(true);
        localStorage.setItem('lawethub_is_logged_in', 'true');
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const loginWithNip = (nip, password) => {
    const found = employees.find(e => e.nip === nip.trim());
    if (!found) {
      return { success: false, message: 'NIP tidak ditemukan dalam pangkalan data ASN.' };
    }
    if (password !== '123456' && password !== found.password) {
      return { success: false, message: 'Kata sandi tidak sesuai. (Kata sandi demo: 123456)' };
    }
    setCurrentUser(found);
    setIsAuthenticated(true);
    localStorage.setItem('lawethub_user_id', found.id);
    localStorage.setItem('lawethub_is_logged_in', 'true');
    return { success: true, user: found };
  };

  const loginAsUser = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('lawethub_user_id', user.id);
    localStorage.setItem('lawethub_is_logged_in', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lawethub_is_logged_in');
  };

  const switchUser = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('lawethub_user_id', user.id);
    localStorage.setItem('lawethub_is_logged_in', 'true');
  };

  const refreshCurrentUserData = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/employees/${currentUser.id}`);
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      employees,
      currentUser,
      isAuthenticated,
      loginWithNip,
      loginAsUser,
      logout,
      switchUser,
      refreshCurrentUserData,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
