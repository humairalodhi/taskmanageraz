import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./Context/ThemeContext";

import Dashboard from "./Pages/Dashboard/Dashboard";
import Calender from "./Pages/Calender/Calender";
import AllTask from "./Pages/AllTask/AllTask";
import Stats from "./Pages/Stats/Stats";
import Setting from "./Pages/Settings/Setting";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import ProtectedRoute from "./Component/ProtectedRoute/Protected";

function App() {
  return (
    <ThemeProvider>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            background: "#1e293b",
            color: "#ffffff",
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "14px 18px",
          },

          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <BrowserRouter>
        <Routes>

          {/* Login - website open hote hi */}
          {/* <Route
            path="/"
            element={<Login />}
          /> */}

          {/* Login */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* Dashboard */}
          <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

          {/* All Tasks */}
          <Route
            path="/all-tasks"
            element={<AllTask />}
          />

          {/* Calendar */}
          <Route
            path="/calendar"
            element={<Calender />}
          />

          {/* Statistics */}
          <Route
            path="/stats"
            element={<Stats />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<Setting />}
          />

          {/* Unknown URL → Login */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </BrowserRouter>

    </ThemeProvider>
  );
}

export default App;