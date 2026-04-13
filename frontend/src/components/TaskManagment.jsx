
import { useState } from "react";
import axios from "axios";

export const TaskManagment = ({ employees }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [assignedEmp, setAssignedEmp] = useState("");
  const [suggestions, setSuggestion] = useState([]);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleTaskSuggestion = async () => {
    if (taskTitle.trim().length <= 3) {
      setErrorMsg("Please enter at least 4 characters in Task Title.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    try {
      setLoadingSuggestion(true);
      setErrorMsg("");
      setSuggestion([]);
      const response = await axios.post(
        "http://localhost:5000/api/task/suggest",
        { input: taskTitle.trim() }
      );
      const lines = (response.data.suggestion || "")
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      setSuggestion(lines);
    } catch (error) {
      if (error?.response?.status === 429) {
        const retryAfter = error.response.data?.retryAfter || 30;
        setErrorMsg(`⏳ Too many requests. Please wait ${retryAfter}s and try again.`);
        setTimeout(() => setErrorMsg(""), retryAfter * 1000);
      } else {
        setErrorMsg("Failed to fetch suggestions. Try again.");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleAssignTask = async () => {
    if (!taskTitle || !taskDesc || !assignedEmp) {
      setErrorMsg("Please fill all fields before assigning.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/task/createTask", {
        taskTitle,
        taskDesc,
        assignedEmp,
      });
      setTaskTitle("");
      setTaskDesc("");
      setAssignedEmp("");
      setSuggestion([]);
      setSuccessMsg("✅ Task assigned successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Error creating task", error);
      setErrorMsg("Failed to assign task. Try again.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  return (
    <div className="task-wrapper bg-white shadow-md rounded p-5 w-7/12">
      <h2 className="text-3xl text-center font-semibold mb-5">Assign Task</h2>

      {successMsg && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-center font-medium">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
          {errorMsg}
        </div>
      )}

      {/* Task Title */}
      <div className="input-group mb-4">
        <label className="block mb-2">Enter Task Title</label>
        <input
          type="text"
          placeholder="Enter Task Title"
          value={taskTitle}
          onChange={(e) => { setTaskTitle(e.target.value); setSuggestion([]); }}
          className="border w-full p-2"
        />
      </div>

      {/* Task Description with AI suggestions overlapping as dropdown */}
      <div className="input-group mb-4 relative">
        <label className="block mb-2">Enter Task Description</label>
        <textarea
          placeholder="Enter Task Description or click  AI Suggest"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
          className="border w-full p-2"
          rows={2}
        />
        {/* AI suggestions overlap as absolute dropdown over description */}
        {suggestions.length > 0 && (
          <ul className="absolute z-20 w-full bg-white border border-purple-300 shadow-xl rounded mt-1 top-full left-0">
            <li className="px-3 py-1 text-xs text-purple-500 font-semibold bg-purple-50 border-b">
              💡 Click a suggestion to use it as description
            </li>
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="px-3 py-2 hover:bg-purple-50 cursor-pointer text-sm border-b last:border-0"
                onClick={() => { setTaskDesc(s); setSuggestion([]); }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Select Employee */}
      <div className="input-group mb-4">
        <label className="block mb-2">Select Employee</label>
        <select
          onChange={(e) => setAssignedEmp(e.target.value)}
          value={assignedEmp}
          className="border w-full p-2"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.empId} value={emp.empName}>
              {emp.empName}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="btn-group text-center flex justify-center gap-3">
        <button
          onClick={handleTaskSuggestion}
          disabled={loadingSuggestion}
          className="w-1/3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white py-3 rounded transition"
        >
          {loadingSuggestion ? "⏳ Generating..." : " AI Suggest"}
        </button>
        <button
          onClick={handleAssignTask}
          className="w-1/2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded transition"
        >
          Assign Task
        </button>
      </div>
    </div>
  );
};
