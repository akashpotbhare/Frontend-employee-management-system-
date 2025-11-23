import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/common/Layout";
import PrivateRoute from "./components/common/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TeamManagement from "./pages/manager/TeamManagement";
import Attendance from "./pages/Attendance";
import RoleManagement from "./pages/admin/RoleManagement";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import SelfAttendance from "./pages/employee/SelfAttendance";
import { ROLES } from "./utils/constants";

const queryClient = new QueryClient();

const ProtectedLayout = () => (
  <PrivateRoute>
    <Layout>
      <Outlet />
    </Layout>
  </PrivateRoute>
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
      />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/team"
          element={
            <PrivateRoute roles={[ROLES.MANAGER]}>
              <TeamManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute
              roles={[ROLES.ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.EMPLOYEE]}
            >
              <Attendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute roles={[ROLES.ADMIN]}>
              <RoleManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <PrivateRoute roles={[ROLES.ADMIN]}>
              <EmployeeManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/self-attendance"
          element={
            <PrivateRoute roles={[ROLES.MANAGER, ROLES.EMPLOYEE]}>
              <SelfAttendance />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
