
import { useEffect, useState } from "react";
import { EmployeManagment } from "./components/EmployeeManagment";
import Header from "./components/Header";
import { TaskManagment } from "./components/TaskManagment";
import { TaskBord } from "./components/EmployeeTabs";

function App() {
  const [employees, setEmployees] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [error, setError] = useState("");

  const fetchEmployees = () => {
    fetch("http://localhost:5000/api/emp/empList")
      .then((res) => { if (!res.ok) throw new Error("failed to fetch employees"); return res.json(); })
      .then((data) => setEmployees(data))
      .catch((err) => setError(err.message));
  };

  const fetchTasks = () => {
    fetch("http://localhost:5000/api/task/getTaskList")
      .then((res) => { if (!res.ok) throw new Error("failed to fetch tasks"); return res.json(); })
      .then((data) => setTaskList(data))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/api/task/${taskId}`, { method: "DELETE" });
      setTaskList((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div id="container" className="bg-gray-100 min-h-screen">
      <Header />
      <div className="w-10/12 m-auto">
        <main className="flex justify-between">
          <EmployeManagment onEmployeeAdded={fetchEmployees} />
          <TaskManagment employees={employees} onTaskAdded={fetchTasks} />
        </main>
        <TaskBord taskList={taskList} onDeleteTask={handleDeleteTask} />
      </div>
    </div>
  );
}

export default App;
