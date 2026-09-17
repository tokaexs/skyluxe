"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { useUser, useClerk } from "@clerk/nextjs";

// Utility to manage cookies on the client side
function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [hasLegacyToken, setHasLegacyToken] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check legacy token on mount
    const token = getCookie("skyluxe_auth_token");
    if (token) {
      setHasLegacyToken(true);
      useSkyLuxeStore.getState().fetchInitialData();
    }
  }, []);

  const isAuthenticated = Boolean(isSignedIn || hasLegacyToken);
  const isLoading = !isLoaded;

  const login = (token: string) => {
    setCookie("skyluxe_auth_token", token, 7); // 7 days expiration
    setHasLegacyToken(true);
    useSkyLuxeStore.getState().fetchInitialData();
  };

  const logout = async () => {
    eraseCookie("skyluxe_auth_token");
    setHasLegacyToken(false);
    try {
      await signOut({ redirectUrl: "/" });
    } catch (e) {
      console.error("Clerk sign out error:", e);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
