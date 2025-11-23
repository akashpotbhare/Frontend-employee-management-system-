export const normalizeRole = (role) =>
  typeof role === "string" ? role.toLowerCase() : "";

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  HR: "hr",
  EMPLOYEE: "employee",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.MANAGER]: "Manager",
  [ROLES.HR]: "HR",
  [ROLES.EMPLOYEE]: "Employee",
};

export const formatRole = (role) => ROLE_LABELS[normalizeRole(role)] ?? "User";

export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LEAVE: "leave",
};

export const ROLE_OPTIONS = [
  { value: "Manager", label: ROLE_LABELS[ROLES.MANAGER] },
  { value: "Hr", label: ROLE_LABELS[ROLES.HR] },
  { value: "Employee", label: ROLE_LABELS[ROLES.EMPLOYEE] },
];