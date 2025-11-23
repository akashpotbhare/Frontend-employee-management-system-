import api from "./api";
import { jwtDecode } from "jwt-decode";

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),

  register: (payload) => api.post("/auth/register", payload),

  decodeToken: (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  },
};