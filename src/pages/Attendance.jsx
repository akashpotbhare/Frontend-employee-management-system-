import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { employeeService } from "../services/employeeService";
import { useAuth } from "../contexts/AuthContext";
import { ROLES, ATTENDANCE_STATUS } from "../utils/constants";
import { Calendar, Search, Filter } from "lucide-react";
import { format } from "date-fns";

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { user } = useAuth();
  const userRole = user?.role;
  const isSelfView = [ROLES.EMPLOYEE, ROLES.MANAGER].includes(userRole);

  const attendanceQuery = useQuery(
    ["attendance", userRole],
    () =>
      isSelfView
        ? employeeService.viewOwnAttendance()
        : employeeService.viewAttendance(),
    {
      enabled: Boolean(user?.role),
      select: (response) => response.data.data || [],
    }
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      [ATTENDANCE_STATUS.PRESENT]: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Present",
      },
      [ATTENDANCE_STATUS.ABSENT]: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Absent",
      },
      [ATTENDANCE_STATUS.LEAVE]: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Leave",
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredAttendance = useMemo(() => {
    const records = attendanceQuery.data || [];
    return records.filter((record) => {
      const matchesSearch =
        record.employee_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        record.employee_email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [attendanceQuery.data, searchTerm, statusFilter]);

  if (attendanceQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isSelfView ? "My Attendance" : "Attendance Records"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isSelfView
            ? "View your attendance history"
            : "View and manage attendance records"}
        </p>
      </div>

      {attendanceQuery.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {attendanceQuery.error?.response?.data?.message ||
            "Failed to load attendance records"}
        </div>
      )}

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value={ATTENDANCE_STATUS.PRESENT}>Present</option>
              <option value={ATTENDANCE_STATUS.ABSENT}>Absent</option>
              <option value={ATTENDANCE_STATUS.LEAVE}>Leave</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {!isSelfView && (
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Employee
                  </th>
                )}
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Recorded
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr
                  key={record.attendance_id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {!isSelfView && (
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {record.employee_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.employee_email}
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="py-3 px-4 text-gray-600">
                    {format(new Date(record.date), "MMM dd, yyyy")}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {format(new Date(record.created_at), "MMM dd, yyyy HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAttendance.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No attendance records
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || statusFilter
                  ? "No records match your filters."
                  : "No attendance records found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
