import axios from "axios";

export const TaskBord = ({ taskList, onDeleteTask }) => {
  return (
    <div className="bg-white mt-5 p-5">
      <h3 className="text-3xl font-bold mb-5">Task Board</h3>
      {taskList.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No tasks assigned yet.</p>
      ) : (
        <ul className="flex justify-around flex-wrap">
          {taskList.map((task) => (
            <li
              key={task._id}
              className="relative mx-3 bg-blue-100 p-5 w-1/4 mb-5 rounded shadow-sm"
            >
              {/* Delete button */}
              <button
                onClick={() => onDeleteTask(task._id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold text-lg leading-none"
                title="Delete task"
              >
                ✕
              </button>

              <p className="font-semibold text-indigo-700 mb-1">
                👤 {task.assignedEmp}
              </p>
              <p className="font-medium mb-1">
                📋 {task.taskTitle}
              </p>
              {/* Description — max 4 lines with ellipsis */}
              <p
                className="text-sm text-gray-600 mb-2"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {task.taskDesc}
              </p>
              <p className="font-bold text-green-700 text-sm">
                ⏱ {task.estimatedTime}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

