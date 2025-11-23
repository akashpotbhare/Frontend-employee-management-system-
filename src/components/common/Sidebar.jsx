import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ROLES } from "../../utils/constants";
import {
  Users,
  Calendar,
  Settings,
  Home,
  UserPlus,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { hasAnyRole } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.HR, ROLES.EMPLOYEE],
    },
    {
      name: "Manage Employees",
      href: "/admin/employees",
      icon: UserPlus,
      roles: [ROLES.ADMIN],
    },
    {
      name: "Team Management",
      href: "/team",
      icon: Users,
      roles: [ROLES.MANAGER],
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: Calendar,
      roles: [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.EMPLOYEE],
    },
    {
      name: "My Attendance",
      href: "/self-attendance",
      icon: CheckCircle,
      roles: [ROLES.MANAGER, ROLES.EMPLOYEE],
    },
    {
      name: "Role Management",
      href: "/roles",
      icon: Settings,
      roles: [ROLES.ADMIN],
    },
  ];

  const filteredNavigation = navigation.filter((item) =>
    hasAnyRole(item.roles)
  );

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        <div className="space-y-2 px-4">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <Icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
