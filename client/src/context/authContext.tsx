import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { authApi } from "@/api/authApi";
import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const isLoggedIn = !!user;

  // Check authentication when the app starts
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const currentUser = await authApi.me();
        setUser(currentUser);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    loadUser();
  }, []);

  const login = async () => {
    const currentUser = await authApi.me();
    setUser(currentUser);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}