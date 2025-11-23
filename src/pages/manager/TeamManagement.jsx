import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { employeeService } from "../../services/employeeService";
import { useAuth } from "../../contexts/AuthContext";
import { Users, Plus, Search } from "lucide-react";
import { formatRole } from "../../utils/constants";

const TeamManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployeeId, setNewEmployeeId] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const teamQuery = useQuery(
    ["team-members"],
    () => employeeService.getTeamEmployees(),
    {
      select: (response) => response.data.data || [],
    }
  );

  const addMemberMutation = useMutation(
    (payload) => employeeService.addEmployeeToTeam(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["team-members"]);
        setNewEmployeeId("");
        setFormMessage("Employee added successfully.");
        setIsModalOpen(false);
      },
      onError: (error) => {
        setFormMessage(
          error.response?.data?.message || "Failed to add employee to team"
        );
      },
    }
  );

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployeeId.trim() || addMemberMutation.isLoading) return;

    addMemberMutation.mutate({
      managerId: user?.id,
      employeeId: Number(newEmployeeId),
    });
  };

  const filteredMembers = useMemo(() => {
    const members = teamQuery.data || [];
    return members.filter(
      (member) =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teamQuery.data, searchTerm]);

  if (teamQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your team members and their details
          </p>
        </div>
        <button
          onClick={() => {
            setFormMessage("");
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {teamQuery.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {teamQuery.error?.response?.data?.message ||
            "Failed to load team members"}
        </div>
      )}

      {formMessage && !isModalOpen && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          {formMessage}
        </div>
      )}

      <div className="card p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

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
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.user_id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{member.email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {formatRole(member.role)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No team members
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm
                  ? "No team members match your search."
                  : "Get started by adding employees to your team."}
              </p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Employee to Team
            </h3>
            {formMessage && (
              <div className="mb-4 text-sm text-red-600">{formMessage}</div>
            )}
            <form onSubmit={handleAddEmployee}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="employeeId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employee ID
                  </label>
                  <input
                    id="employeeId"
                    type="number"
                    value={newEmployeeId}
                    onChange={(e) => setNewEmployeeId(e.target.value)}
                    className="input-field mt-1"
                    placeholder="Enter employee ID"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormMessage("");
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMemberMutation.isLoading}
                  className="btn-primary"
                >
                  {addMemberMutation.isLoading ? "Adding..." : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
