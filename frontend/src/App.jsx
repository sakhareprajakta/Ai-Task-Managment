/* import { useEffect, useState } from "react";
import { EmployeManagment } from "./components/EmployeeManagment";
import Header from "./components/Header";
import { TaskManagment } from "./components/TaskManagment";
import { TaskBord } from "./components/EmployeeTabs";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

function App() {
  // ── Auth state 
  const [token, setToken] = useState(localStorage.getItem("tm_token") || null);
  const [user, setUser]   = useState(() => {
    const saved = localStorage.getItem("tm_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  // ── App state
  const [employees, setEmployees] = useState([]);
  const [taskList, setTaskList]   = useState([]);
  const [error, setError]         = useState("");

  const isAdmin = user?.role === "admin";

  // ── Auth helpers
  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("tm_token");
    localStorage.removeItem("tm_user");
    setToken(null);
    setUser(null);
    setEmployees([]);
    setTaskList([]);
  };

  // ── Auth headers 
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ── Fetch helpers 
  const fetchEmployees = () => {
    fetch("http://localhost:5000/api/emp/empList", { headers: authHeaders })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch employees");
        return res.json();
      })
      .then((data) => setEmployees(data))
      .catch((err) => setError(err.message));
  };

  const fetchTasks = () => {
    fetch("http://localhost:5000/api/task/getTaskList", { headers: authHeaders })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => setTaskList(data))
      .catch((err) => setError(err.message));
  };

  // Fetch when token is available
  useEffect(() => {
    if (token) {
      fetchEmployees();
      fetchTasks();
    }
  }, [token]);

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/api/task/${taskId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setTaskList((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // ── Not logged in → show Login or Register 
  if (!user || !token) {
    return authMode === "login" ? (
      <LoginPage
        onLogin={handleLogin}
        onSwitch={() => setAuthMode("register")}
      />
    ) : (
      <RegisterPage
        onLogin={handleLogin}
        onSwitch={() => setAuthMode("login")}
      />
    );
  }

  // ── Logged in → existing app 
  return (
    <div id="container" className="bg-gray-100 min-h-screen">

      {/* Header gets user info + logout button 
      <Header user={user} onLogout={handleLogout} />

      <div className="w-10/12 m-auto">

        {/* Error banner 
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded px-4 py-2 mt-4 text-sm">
            {error}
            <button onClick={() => setError("")} className="ml-4 font-bold">✕</button>
          </div>
        )}

        <main className="flex justify-between">

          {/* Admin only — employee & task management panels 
          {isAdmin && (
            <EmployeManagment
              onEmployeeAdded={fetchEmployees}
              token={token}
            />
          )}
          {isAdmin && (
            <TaskManagment
              employees={employees}
              onTaskAdded={fetchTasks}
              token={token}
            />
          )}

          {/* Regular user — welcome message 
          {!isAdmin && (
            <p className="mt-6 text-gray-500 text-sm">
              👋 Welcome, <strong>{user.name}</strong>. Your assigned tasks are shown below.
            </p>
          )}

        </main>

        {/* Task board — all users see it (backend filters by role) 
        <TaskBord
          taskList={taskList}
          onDeleteTask={isAdmin ? handleDeleteTask : null}
          token={token}
          isAdmin={isAdmin}
        />

      </div>
    </div>
  );
}

export default App; */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;