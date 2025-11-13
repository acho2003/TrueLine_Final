import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { loginUser } from '../services/api';
import { User } from '../types'; // Assuming you have a User type in types.ts

// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The provider component that will wrap your app
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Line 24 (or near it) - This is where the error was happening.
  // It failed because 'useState' was not correctly imported.
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to check for stored user

  // Check for an existing token in localStorage when the app loads
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      
      if (storedToken && storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser({ ...parsedUser, token: storedToken });
      }
    } catch (error) {
      console.error("Failed to parse stored user data:", error);
      // Clear potentially corrupted data
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      localStorage.setItem('authToken', userData.token);
      // Store user details separately from the token
      localStorage.setItem('authUser', JSON.stringify({ _id: userData._id, name: userData.name, email: userData.email }));
    } catch (error) {
      console.error('Login failed:', error);
      // Re-throw the error so the login page can catch it and display a message
      throw error;
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = React.useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the context in other components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};