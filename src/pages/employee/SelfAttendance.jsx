import React, { useState } from "react";
import { format } from "date-fns";
import { ATTENDANCE_STATUS } from "../../utils/constants";
import { employeeService } from "../../services/employeeService";
import { CalendarCheck } from "lucide-react";

const SelfAttendance = () => {
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    status: ATTENDANCE_STATUS.PRESENT,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await employeeService.addEmployeeAttendance({
        date: formData.date,
        status: formData.status,
      });
      setMessage("Attendance marked successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to mark attendance. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Mark My Attendance
        </h1>
        <p className="text-gray-600 mt-2">
          Record your attendance for the selected date.
        </p>
      </div>

      <div className="card p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarCheck className="inline w-4 h-4 mr-2 text-primary-600" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
              max={format(new Date(), "yyyy-MM-dd")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance Status
            </label>
            <div className="flex space-x-4">
              {Object.values(ATTENDANCE_STATUS).map((status) => (
                <label key={status} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={handleChange}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="capitalize text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {message && (
            <div
              className={`px-4 py-3 rounded-lg ${
                message.includes("success")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            )}
            <span>{submitting ? "Marking..." : "Mark Attendance"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SelfAttendance;

