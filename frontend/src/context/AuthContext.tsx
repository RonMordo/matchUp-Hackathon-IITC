import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import type { User, UserResponse } from "@/types/index";
import Services from "@/services";

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, phone: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

axios.defaults.withCredentials = true;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = Services.Auth;

  //CheckAuth
  const checkAuth = async () => {
    try {
      const response = await authService.getMe();
      const user = response.data;
      setUser(user);
    } catch (error) {
      console.error("Auth check failed", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  //signIn
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      const user = response.data;
      setUser(user);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  //SignUp
  const register = async (name: string, phone: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register(name, phone, email, password);
      const user = response.data;
      console.log(user);
      setUser(user);
      return true;
    } catch (error) {
      console.error("Registration Error!", error);
      return false;
    }
  };

  //logout
  const logout = async () => {
    try {
      authService.logout();
      setUser(null);
    } catch (error) {
      console.log("Logout error!", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
