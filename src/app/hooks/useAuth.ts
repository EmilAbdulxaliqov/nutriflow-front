import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import * as authService from "../services/authService";
import type { LoginPayload } from "../services/authService";

/**
 * Provides auth state and helpers for login / logout.
 * Wrap usage in a component so React hooks rules are respected.
 */
export function useAuth() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("accessToken")
  );

  /** Log in and persist the token, then navigate based on role claims. */
  const login = useCallback(
    async (payload: LoginPayload) => {
      const data = await authService.login(payload);
      const newToken = data?.accessToken ?? localStorage.getItem("accessToken");
      setToken(newToken);
      return data;
    },
    []
  );

  /** Clear the stored token and redirect to the login page. */
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setToken(null);
    navigate("/login");
  }, [navigate]);

  return { token, login, logout, isAuthenticated: !!token };
}
