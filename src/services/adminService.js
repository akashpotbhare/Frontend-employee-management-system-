import api from "./api";

export const adminService = {
  listEmployees: () => api.get("/admin/employees"),
  createEmployee: (payload) => api.post("/admin/employees", payload),
};

