"// Fix unused imports" 
"import { useState } from 'react';" 

// Simple authentication hook
export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  // Default admin credentials (in a real app, this would be server-side)
  const adminCredentials = {
    username: 'admin',
    password: 'password123'
  };

  const login = (username: string, password: string): boolean => {
    const isValidLogin = username === adminCredentials.username && 
                         password === adminCredentials.password;
    
    if (isValidLogin) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
    }
    
    return isValidLogin;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return {
    isAdmin,
    login,
    logout
  };
};
