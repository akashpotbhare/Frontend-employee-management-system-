import React, { useState } from "react";
import { roleService } from "../../services/roleService";
import { useAuth } from "../../contexts/AuthContext";
import { ROLE_OPTIONS } from "../../utils/constants";
import { Settings, UserPlus } from "lucide-react";

const RoleManagement = () => {
  const [formData, setFormData] = useState({
    admin_id: "",
    user_id: "",
    new_role: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Use the current admin's ID
      const submitData = {
        ...formData,
        admin_id: user?.id,
      };

      await roleService.assignRole(submitData);
      setMessage("Role assigned successfully!");
      setFormData({
        admin_id: "",
        user_id: "",
        new_role: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to assign role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        <p className="text-gray-600 mt-2">
          Assign and manage user roles in the system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Assign Role
          </h3>

          {message && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg ${
                message.includes("successfully")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="user_id"
                className="block text-sm font-medium text-gray-700"
              >
                User ID
              </label>
              <input
                id="user_id"
                name="user_id"
                type="number"
                required
                value={formData.user_id}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter user ID to assign role"
              />
            </div>

            <div>
              <label
                htmlFor="new_role"
                className="block text-sm font-medium text-gray-700"
              >
                New Role
              </label>
              <select
                id="new_role"
                name="new_role"
                required
                value={formData.new_role}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="">Select a role</option>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <UserPlus className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Admin Information
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Role assignment will be performed by:{" "}
                    <strong>{user.name}</strong> (ID: {user?.id})
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? "Assigning Role..." : "Assign Role"}
            </button>
          </form>
        </div>

        {/* <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Role Information
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Admin</h4>
              <p className="text-sm text-gray-600">
                Full system access. Can assign roles, manage all users and
                system settings.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Manager</h4>
              <p className="text-sm text-gray-600">
                Can manage team members, mark attendance for team, and view team
                reports.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">HR</h4>
              <p className="text-sm text-gray-600">
                Can view all attendance records and generate reports for the
                organization.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Employee</h4>
              <p className="text-sm text-gray-600">
                Can view own attendance records and update personal information.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default RoleManagement;
