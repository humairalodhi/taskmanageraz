import { useEffect, useState } from "react";
import "./Taskinput.css";


const TaskInput = ({
  addTask,
  selectedDate,
  setSelectedDate,
}) => {

  // =========================
  // TASK
  // =========================

  const [task, setTask] = useState("");


  // =========================
  // DATE
  // =========================

  const [date, setDate] = useState(
    selectedDate ||
    new Date().toISOString().split("T")[0]
  );


  // =========================
  // UPDATE DATE
  // =========================

  useEffect(() => {

    if (selectedDate) {

      setDate(selectedDate);

    }

  }, [selectedDate]);


  // =========================
  // ADD TASK
  // =========================

  const handleAdd = () => {

    if (!task.trim()) {
      return;
    }


    addTask(
      task,
      date
    );


    setTask("");

  };


  // =========================
  // ENTER KEY
  // =========================

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      handleAdd();

    }

  };


  // =========================
  // DATE CHANGE
  // =========================

  const handleDateChange = (e) => {

    const newDate =
      e.target.value;


    setDate(newDate);


    // Dashboard ki selected date bhi update karo
    if (setSelectedDate) {

      setSelectedDate(newDate);

    }

  };


  return (

    <div className="addTask">


      {/* TASK INPUT */}

      <div className="taskInputBox">

        <input

          type="text"

          placeholder="Add a new task..."

          value={task}

          onChange={(e) =>
            setTask(e.target.value)
          }

          onKeyDown={handleKeyDown}

        />

      </div>


      {/* DATE INPUT */}

      <div className="dateInputBox">

        <input

          type="date"

          value={date}

          onChange={
            handleDateChange
          }

        />

      </div>


      {/* ADD BUTTON */}

      <button

        className="addTaskButton"

        onClick={handleAdd}

      >
        Add Task

      </button>


    </div>

  );

};


export default TaskInput;