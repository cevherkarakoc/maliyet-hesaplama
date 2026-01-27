import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  username: string | null;
  password: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  getAuthHeader: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem("auth_username");
  });
  const [password, setPassword] = useState<string | null>(() => {
    return localStorage.getItem("auth_password");
  });

  const isAuthenticated = !!username && !!password;

  const getAuthHeader = () => {
    if (username && password) {
      return "Basic " + btoa(`${username}:${password}`);
    }
    return "";
  };

  useEffect(() => {
    if (username && password) {
      localStorage.setItem("auth_username", username);
      localStorage.setItem("auth_password", password);
    } else {
      localStorage.removeItem("auth_username");
      localStorage.removeItem("auth_password");
    }
  }, [username, password]);

  const login = (user: string, pass: string) => {
    // Önce localStorage'a yaz, sonra state'i güncelle
    localStorage.setItem("auth_username", user);
    localStorage.setItem("auth_password", pass);
    setUsername(user);
    setPassword(pass);
  };

  const logout = () => {
    localStorage.removeItem("auth_username");
    localStorage.removeItem("auth_password");
    setUsername(null);
    setPassword(null);
  };

  return (
    <AuthContext.Provider value={{ username, password, isAuthenticated, login, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
