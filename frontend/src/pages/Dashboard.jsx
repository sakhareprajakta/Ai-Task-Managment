import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const BASE = "https://ai-task-managment.onrender.com/api";
export default function Dashboard() {
  const { user, token, isAdmin, logout } = useAuth();
  const [suggestion, setSuggestion] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks"); // tasks | employees | addTask | addEmp

  // Form state
  const [taskForm, setTaskForm] = useState({
    taskTitle: "",
    taskDesc: "",
    assignedEmp: "",
    assignedTo: "",
    status: "todo",
  });
  const [empForm, setEmpForm] = useState({
    empId: "",
    empName: "",
    empSkills: "",
  });
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BASE}/task/getTaskList`, { headers });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch {}
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${BASE}/emp/empList`, { headers });
      const data = await res.json();
      if (res.ok) setEmployees(data);
    } catch {}
  };

  let lastQuery = "";

  const fetchSuggestion = async () => {
    if (lastQuery === taskForm.taskTitle) return;
    lastQuery = taskForm.taskTitle;

    try {
      const res = await fetch(`${BASE}/task/suggest`, {
        method: "POST",
        headers,
        body: JSON.stringify({ input: taskForm.taskTitle }),
      });

      const data = await res.json();

      if (data?.suggestion) {
        setSuggestion(data.suggestion);

        setTaskForm((prev) => ({
          ...prev,
          taskDesc: data.suggestion,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([
        fetchTasks(),
        isAdmin ? fetchEmployees() : Promise.resolve(),
      ]);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!taskForm.taskTitle || taskForm.taskTitle.length < 5) return;

    const delay = setTimeout(() => {
      fetchSuggestion();
    }, 1500);

    return () => clearTimeout(delay);
  }, [taskForm.taskTitle]);

  // ── Status update (all users) ──────────────────────────────
  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await fetch(`${BASE}/task/${taskId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      });
      if (res.ok)
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status } : t)),
        );
    } catch {}
  };

  // ── Delete task (admin) ────────────────────────────────────
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await fetch(`${BASE}/task/${taskId}`, { method: "DELETE", headers });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch {}
  };

  // ── Delete employee (admin) ────────────────────────────────
  const handleDeleteEmp = async (empId) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await fetch(`${BASE}/emp/${empId}`, { method: "DELETE", headers });
      setEmployees((prev) => prev.filter((e) => e._id !== empId));
    } catch {}
  };

  // ── Create task (admin) ────────────────────────────────────
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.taskTitle) {
      setFormMsg({ type: "error", text: "Task title is required." });
      return;
    }
    setSaving(true);
    setFormMsg({});
    try {
      const res = await fetch(`${BASE}/task/createTask`, {
        method: "POST",
        headers,
        body: JSON.stringify(taskForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormMsg({ type: "success", text: "Task created successfully!" });
      setTaskForm({
        taskTitle: "",
        taskDesc: "",
        assignedEmp: "",
        assignedTo: "",
        status: "todo",
      });
      fetchTasks();
      setTimeout(() => setActiveTab("tasks"), 1200);
      console.log("Sending Task:", taskForm);
    } catch (err) {
      setFormMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // ── Create employee (admin) ────────────────────────────────
  const handleCreateEmp = async (e) => {
    e.preventDefault();
    if (!empForm.empId || !empForm.empName) {
      setFormMsg({ type: "error", text: "Employee ID and Name are required." });
      return;
    }
    setSaving(true);
    setFormMsg({});
    try {
      const res = await fetch(`${BASE}/emp/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(empForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormMsg({ type: "success", text: "Employee added successfully!" });
      setEmpForm({ empId: "", empName: "", empSkills: "" });
      fetchEmployees();
      setTimeout(() => setActiveTab("employees"), 1200);
    } catch (err) {
      setFormMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSuggest = async () => {
    try {
      const res = await fetch(`${BASE}/task/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          input: taskForm.taskTitle, // 🔴 IMPORTANT
        }),
      });

      const data = await res.json();

      console.log("AI Suggestion:", data);

      // 👉 Show suggestion in description
      setTaskForm((prev) => ({
        ...prev,
        taskDesc: data.suggestion || prev.taskDesc,
      }));
    } catch (err) {
      console.error("AI error:", err.message);
    }
  };

  const statusColor = {
    todo: "#6b7280",
    "in-progress": "#d97706",
    done: "#16a34a",
  };
  const statusLabel = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  if (loading)
    return <div className="dash-loading">Loading your dashboard…</div>;

  return (
    <div className="dash-wrap">
      {/* ── Header ── */}
      <header className="dash-header">
        <div className="dash-header-left">
          <span className="dash-logo">⚡ TaskFlow</span>
          <span
            className={`dash-role-badge ${isAdmin ? "badge-admin" : "badge-user"}`}
          >
            {isAdmin ? "🛡️ Admin" : "👤 Employee"}
          </span>
        </div>
        <div className="dash-header-right">
          <span className="dash-username">Hi, {user.name}</span>
          <button className="dash-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      {/* ── Tabs ── */}
      <div className="dash-tabs">
        <button
          className={`dash-tab ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("tasks");
            setFormMsg({});
          }}
        >
          📋 {isAdmin ? "All Tasks" : "My Tasks"}
        </button>
        {isAdmin && (
          <button
            className={`dash-tab ${activeTab === "employees" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("employees");
              setFormMsg({});
            }}
          >
            👥 Employees
          </button>
        )}
        {isAdmin && (
          <button
            className={`dash-tab ${activeTab === "addTask" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("addTask");
              setFormMsg({});
            }}
          >
            ＋ Add Task
          </button>
        )}
        {isAdmin && (
          <button
            className={`dash-tab ${activeTab === "addEmp" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("addEmp");
              setFormMsg({});
            }}
          >
            ＋ Add Employee
          </button>
        )}
      </div>

      <div className="dash-content">
        {/* ── TASKS VIEW ── */}
        {activeTab === "tasks" && (
          <div>
            <div className="dash-section-header">
              <h2>{isAdmin ? "All Tasks" : "My Assigned Tasks"}</h2>
              <span className="dash-count">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="dash-empty">
                <span>📭</span>
                <p>
                  {isAdmin
                    ? "No tasks yet. Add one!"
                    : "No tasks assigned to you yet."}
                </p>
              </div>
            ) : (
              <div className="task-grid">
                {tasks.map((task) => (
                  <div key={task._id} className="task-card">
                    <div className="task-card-header">
                      <h3 className="task-title">{task.taskTitle}</h3>
                      <span
                        className="task-status-dot"
                        style={{
                          background: statusColor[task.status || "todo"],
                        }}
                      />
                    </div>
                    {task.taskDesc && (
                      <p className="task-desc">{task.taskDesc}</p>
                    )}
                    <div className="task-meta">
                      {task.assignedEmp && (
                        <span className="task-assigned">
                          👤 {task.assignedEmp}
                        </span>
                      )}
                      {task.estimatedTime && (
                        <span className="task-time">
                          ⏱ {task.estimatedTime}
                        </span>
                      )}
                    </div>
                    <div className="task-footer">
                      <select
                        className="task-status-select"
                        value={task.status || "todo"}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      {isAdmin && (
                        <button
                          className="task-delete-btn"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── EMPLOYEES VIEW (Admin only) ── */}
        {activeTab === "employees" && isAdmin && (
          <div>
            <div className="dash-section-header">
              <h2>Employees</h2>
              <span className="dash-count">
                {employees.length} employee{employees.length !== 1 ? "s" : ""}
              </span>
            </div>

            {employees.length === 0 ? (
              <div className="dash-empty">
                <span>👥</span>
                <p>No employees yet. Add one!</p>
              </div>
            ) : (
              <div className="emp-table-wrap">
                <table className="emp-table">
                  <thead>
                    <tr>
                      <th>Emp ID</th>
                      <th>Name</th>
                      <th>Skills</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp._id}>
                        <td>
                          <code>{emp.empId}</code>
                        </td>
                        <td>
                          <strong>{emp.empName}</strong>
                        </td>
                        <td>{emp.empSkills || "—"}</td>
                        <td>
                          <button
                            className="emp-delete-btn"
                            onClick={() => handleDeleteEmp(emp._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ADD TASK FORM (Admin only) ── */}
        {activeTab === "addTask" && isAdmin && (
          <div className="form-wrap">
            <h2 className="form-title">Create New Task</h2>
            <p className="form-sub">
              AI will automatically estimate the time required.
            </p>

            {formMsg.text && (
              <div
                className={
                  formMsg.type === "error" ? "form-error" : "form-success"
                }
              >
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateTask} className="task-form">
              <div className="form-field">
                <label>Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Set up CI/CD pipeline"
                  value={taskForm.taskTitle}
                  onChange={(e) =>
                    setTaskForm((p) => ({ ...p, taskTitle: e.target.value }))
                  }
                />
              </div>
              <div className="form-field">
                <label>Description</label>
                {/* <textarea
                  placeholder="Describe the task in detail…"
                  rows={3}
                  value={taskForm.taskDesc}
                  onChange={(e) => setTaskForm((p) => ({ ...p, taskDesc: e.target.value }))}
                /> */}

                <textarea
                  value={taskForm.taskDesc}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, taskDesc: e.target.value })
                  }
                />

                <button type="button" onClick={fetchSuggestion} className="gen-ai-btn">
                  Generate AI Suggestion
                </button>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Assign to Employee</label>
                  <select
                    value={taskForm.assignedEmp}
                    onChange={(e) => {
                      const emp = employees.find(
                        (em) => em.empName === e.target.value,
                      );
                      setTaskForm((p) => ({
                        ...p,
                        assignedEmp: e.target.value,
                        assignedTo: emp?.userId || "",
                      }));
                    }}
                  >
                    <option value="">— Select employee —</option>
                    {employees.map((em) => (
                      <option key={em._id} value={em.empName}>
                        {em.empName} ({em.empId})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) =>
                      setTaskForm((p) => ({ ...p, status: e.target.value }))
                    }
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="form-btn" disabled={saving}>
                {saving ? <span className="form-spinner" /> : null}
                {saving ? "Creating task…" : "Create Task"}
              </button>
            </form>
          </div>
        )}

        {/* {suggestion && (
          <div className="ai-box">
            <h4>💡 AI Suggestions</h4>

            {suggestion.split("\n").map((item, index) => (
              <div
                key={index}
                className="ai-item"
                onClick={() => setTaskForm({ ...taskForm, taskTitle: item })}
              >
                {item}
              </div>
            ))}
          </div>
        )} */}

        
        {/* ── ADD EMPLOYEE FORM (Admin only) ── */}
        {activeTab === "addEmp" && isAdmin && (
          <div className="form-wrap">
            <h2 className="form-title">Add New Employee</h2>
            <p className="form-sub">
              Add a team member to assign tasks to them.
            </p>

            {formMsg.text && (
              <div
                className={
                  formMsg.type === "error" ? "form-error" : "form-success"
                }
              >
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateEmp} className="task-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Employee ID *</label>
                  <input
                    type="text"
                    placeholder="EMP001"
                    value={empForm.empId}
                    onChange={(e) =>
                      setEmpForm((p) => ({
                        ...p,
                        empId: e.target.value.toUpperCase(),
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={empForm.empName}
                    onChange={(e) =>
                      setEmpForm((p) => ({ ...p, empName: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-field">
                <label>Skills</label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB…"
                  value={empForm.empSkills}
                  onChange={(e) =>
                    setEmpForm((p) => ({ ...p, empSkills: e.target.value }))
                  }
                />
              </div>
              <button type="submit" className="form-btn" disabled={saving}>
                {saving ? <span className="form-spinner" /> : null}
                {saving ? "Adding…" : "Add Employee"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
