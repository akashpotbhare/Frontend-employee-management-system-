import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import { ROLES, formatRole } from "../utils/constants";
import { Users, Calendar, UserCheck, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { employeeService } from "../services/employeeService";

const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role;

  const shouldFetchTeam = role === ROLES.MANAGER;
  const shouldFetchAttendance = [ROLES.HR, ROLES.ADMIN, ROLES.EMPLOYEE].includes(
    role
  );

  const teamQuery = useQuery(
    ["team-members"],
    () => employeeService.getTeamEmployees(),
    {
      enabled: shouldFetchTeam,
      select: (response) => response.data.data || [],
    }
  );

  const attendanceQuery = useQuery(
    ["dashboard-attendance", user?.role],
    () =>
        role === ROLES.EMPLOYEE
        ? employeeService.viewOwnAttendance()
        : employeeService.viewAttendance(),
    {
      enabled: shouldFetchAttendance,
      select: (response) => response.data.data || [],
    }
  );

  const stats = useMemo(() => {
    const values = [];
    if (shouldFetchTeam) {
      values.push({
        name: "Team Members",
        value: teamQuery.data?.length ?? 0,
        icon: Users,
        color: "bg-blue-500",
      });
    }

    if (shouldFetchAttendance) {
      const label =
        user?.role === ROLES.EMPLOYEE
          ? "My Attendance Records"
          : "Attendance Records";
      values.push({
        name: label,
        value: attendanceQuery.data?.length ?? 0,
        icon: Calendar,
        color: "bg-green-500",
      });
    }

    if (role === ROLES.ADMIN) {
      values.push({
        name: "Role Assignments",
        value: "Manage",
        icon: Settings,
        color: "bg-purple-500",
      });
    }

    // if (role === ROLES.MANAGER) {
    //   values.push({
    //     name: "Pending Team Actions",
    //     value: "-",
    //     icon: UserCheck,
    //     color: "bg-yellow-500",
    //   });
    // }

    return values;
  }, [
    shouldFetchTeam,
    shouldFetchAttendance,
    teamQuery.data,
    attendanceQuery.data,
    role,
  ]);

  const quickActions = useMemo(() => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { label: "Add Employees", href: "/admin/employees", variant: "primary" },
          { label: "Assign Roles", href: "/roles", variant: "secondary" },
        ];
      case ROLES.HR:
        return [
          { label: "View Attendance", href: "/attendance", variant: "primary" },
        ];
      case ROLES.MANAGER:
        return [
          { label: "Manage Team", href: "/team", variant: "primary" },
          {
            label: "Mark My Attendance",
            href: "/self-attendance",
            variant: "secondary",
          },
          {
            label: "View My Attendance",
            href: "/attendance",
            variant: "secondary",
          },
        ];
      case ROLES.EMPLOYEE:
        return [
          { label: "Mark My Attendance", href: "/self-attendance", variant: "primary" },
          { label: "View My Attendance", href: "/attendance", variant: "secondary" },
        ];
      default:
        return [];
    }
  }, [role]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name || user?.email}! You are signed in as{" "}
          {formatRole(role)}.
        </p>
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="card p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          {quickActions.length ? (
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  to={action.href}
                  className={`block ${
                    action.variant === "primary" ? "btn-primary" : "btn-secondary"
                  } text-center`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No quick actions available for your role.
            </p>
          )}
        </div>

        {/* <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="text-gray-500 text-center py-8">
            <p>No recent activity</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
