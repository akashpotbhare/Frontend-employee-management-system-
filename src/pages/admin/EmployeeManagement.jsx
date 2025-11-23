import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { adminService } from "../../services/adminService";
import { ROLE_OPTIONS } from "../../utils/constants";
import { UserPlus, Users, RefreshCw } from "lucide-react";

const EmployeeManagement = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: ROLE_OPTIONS[0]?.value || "Manager",
    },
  });

  const employeeQuery = useQuery(
    ["admin-employees"],
    () => adminService.listEmployees(),
    {
      select: (response) => response.data.data || [],
    }
  );

  const createEmployeeMutation = useMutation(
    (payload) => adminService.createEmployee(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["admin-employees"]);
        reset();
      },
    }
  );

  const onSubmit = (values) => {
    createEmployeeMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <p className="text-gray-600 mt-2">
          Create new employees, assign roles, and review the workforce.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-primary-600" />
            <span>Add New Employee</span>
          </h3>

          {createEmployeeMutation.isError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {createEmployeeMutation.error?.response?.data?.message ||
                "Failed to create employee"}
            </div>
          )}

          {createEmployeeMutation.isSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Employee created successfully.
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                className="input-field mt-1"
                placeholder="Enter full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="input-field mt-1"
                placeholder="Enter email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select className="input-field mt-1" {...register("role")}>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temporary Password
              </label>
              <input
                type="password"
                className="input-field mt-1"
                placeholder="Set a temporary password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={createEmployeeMutation.isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {createEmployeeMutation.isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>
                {createEmployeeMutation.isLoading ? "Creating..." : "Create"}
              </span>
            </button>
          </form>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary-600" />
              <span>All Employees</span>
            </h3>
            <button
              onClick={() => queryClient.invalidateQueries(["admin-employees"])}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {employeeQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : employeeQuery.isError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {employeeQuery.error?.response?.data?.message ||
                "Failed to load employees"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeQuery.data.map((employee) => (
                    <tr
                      key={employee.user_id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {employee.email}
                      </td>
                      <td className="py-3 px-4 text-gray-600 capitalize">
                        {employee.role}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            employee.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {employee.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {employeeQuery.data.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No employees found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;

