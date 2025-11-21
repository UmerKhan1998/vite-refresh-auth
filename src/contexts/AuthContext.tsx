import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient } from "@/lib/api";
import Cookies from "js-cookie";

interface User {
  id: string;
  username: string;
  email: string;
  premiumSubscription?: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (token: string) => {
    try {
      const response = await apiClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setUser(null);
      setAccessToken(null);
    }
  };

  const refreshAuth = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiClient.post(
        "/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      if (response.data.success && response.data.accessToken) {
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        Cookies.set("accessToken", newAccessToken);
        await fetchProfile(newAccessToken);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      setUser(null);
      setAccessToken(null);
      Cookies.remove("accessToken");
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("accessToken");
      if (token) {
        setAccessToken(token);
        await fetchProfile(token);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    if (response.data.success && response.data.accessToken) {
      const token = response.data.accessToken;
      setAccessToken(token);
      Cookies.set("accessToken", token);
      await fetchProfile(token);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await apiClient.post("/auth/register", {
      username,
      email,
      password,
      premiumSubscription: false,
    });
    if (response.data.success && response.data.accessToken) {
      const token = response.data.accessToken;
      setAccessToken(token);
      Cookies.set("accessToken", token);
      await fetchProfile(token);
    }
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await apiClient.post(
          "/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      Cookies.remove("accessToken");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
