import { FaTrash } from "react-icons/fa";
import "./Taskitem.css";

const TaskItem = ({
  task,
  toggleTask,
  deleteTask
}) => {

  return (
    <div className="taskItem">

      <div className="taskLeft">

        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
        />

        <div className="taskDetails">

          <div
            className={`taskText ${
              task.completed ? "completedText" : ""
            }`}
          >
            {task.text}
          </div>

          <div className="taskDate">
            {task.date}
          </div>

        </div>

      </div>

      <FaTrash
        className="deleteIcon"
        onClick={() => deleteTask(task.id)}
      />

    </div>
  );
};

export default TaskItem;