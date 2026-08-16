"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Role } from "@/types";
import { api, setTokens, clearTokens, getAccessToken } from "@/lib/api/client";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken?: string, user?: User) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async (): Promise<User | null> => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const profileData = await api.get<User>("/auth/me");
      if (profileData) {
        setUser(profileData);
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(profileData));
        }
        return profileData;
      }
    } catch (err) {
      console.error("Failed to fetch current user profile:", err);
      // Don't clear immediately on network error, fallback to local storage if available
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          clearTokens();
          setUser(null);
        }
      } else {
        clearTokens();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (accessToken: string, refreshToken?: string, initialUser?: User) => {
    setTokens(accessToken, refreshToken);
    if (initialUser) {
      setUser(initialUser);
      localStorage.setItem("user", JSON.stringify(initialUser));
    }
    await refreshProfile();
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
