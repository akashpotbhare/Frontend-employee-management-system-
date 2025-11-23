import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";
import {
  clearSession,
  loadToken,
  loadUser as loadStoredUser,
  saveToken,
  saveUser,
} from "../utils/storage";
import { normalizeRole } from "../utils/constants";

const AuthContext = createContext(null);

const normalizeUser = (payload = {}) => ({
  id: payload.user_id ?? payload.userId ?? payload.id ?? null,
  name: payload.name ?? payload.fullName ?? "",
  email: payload.email ?? "",
  role: normalizeRole(payload.role),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => loadToken());
  const [user, setUser] = useState(() => {
    const stored = loadStoredUser();
    return stored ? normalizeUser(stored) : null;
  });
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (token && !user) {
      const decoded = authService.decodeToken(token);
      if (decoded) {
        const normalized = normalizeUser(decoded);
        setUser(normalized);
        saveUser(normalized);
      }
    }
    setInitializing(false);
  }, [token, user]);

  useEffect(() => {
    const handleForcedLogout = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener("app:logout", handleForcedLogout);
    return () => window.removeEventListener("app:logout", handleForcedLogout);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await authService.login({ email, password });
      const { auth_token, user: userData } = response.data;

      const normalizedUser = normalizeUser(userData);
      saveToken(auth_token);
      saveUser(normalizedUser);
      setToken(auth_token);
      setUser(normalizedUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (payload) => {
    try {
      const response = await authService.register(payload);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      loading: initializing,
      isAuthenticated: Boolean(token && user),
      hasRole: (role) => normalizeRole(role) === user?.role,
      hasAnyRole: (roles = []) => {
        if (!roles.length) return true;
        return roles.some((role) => normalizeRole(role) === user?.role);
      },
    }),
    [user, token, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
