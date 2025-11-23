import api from "./api";

export const employeeService = {
  addEmployeeToTeam: ({ managerId, employeeId }) =>
    api.post("/add-team-employee", {
      manager_id: managerId,
      Employee_id: employeeId,
    }),

  getTeamEmployees: () => api.get("/team-employees"),

  addEmployeeAttendance: (payload) => api.post("/add-attendance", payload),

  viewAttendance: () => api.get("/view-attendance"),

  viewOwnAttendance: () => api.get("/view-own-attendance"),
};