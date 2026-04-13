import axios from "axios";
import { useState } from "react";

export const EmployeManagment = ({ onEmployeeAdded }) => {
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [empSkills, setEmpSkills] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleAddEmp = async (e) => {
    e.preventDefault();
    if (!empId || !empName || !empSkills) return;
    try {
      await axios.post("http://localhost:5000/api/emp/create", { empId, empName, empSkills });
      setEmpId("");
      setEmpName("");
      setEmpSkills("");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      if (onEmployeeAdded) onEmployeeAdded(); // refresh employee list
    } catch (error) {
      console.log("error creating new emp", error);
    }
  };

  return (
    <div className="emp-wrapper bg-white shadow-md rounded p-5 w-1/3 relative">
      <h2 className="text-3xl text-center font-semibold mb-5">Add Employee</h2>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg text-center animate-bounce">
          ✅ Employee Added Successfully!
        </div>
      )}

      <div className="input-group mb-4">
        <label className="block mb-2">Enter Emp Id</label>
        <input
          type="text"
          placeholder="Enter Emp Id"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          className="border w-full p-2"
        />
      </div>
      <div className="input-group mb-4">
        <label className="block mb-2">Enter Emp Name</label>
        <input
          type="text"
          placeholder="Enter Emp Name"
          value={empName}
          onChange={(e) => setEmpName(e.target.value)}
          className="border w-full p-2"
        />
      </div>
      <div className="input-group mb-4">
        <label className="block mb-2">Enter Emp Skills</label>
        <input
          type="text"
          placeholder="Enter Emp Skills"
          value={empSkills}
          onChange={(e) => setEmpSkills(e.target.value)}
          className="border w-full p-2"
        />
      </div>
      <div className="btn-group text-center">
        <button
          className="w-1/2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded transition"
          onClick={handleAddEmp}
        >
          Add New Employee
        </button>
      </div>
    </div>
  );
};
