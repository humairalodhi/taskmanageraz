import TaskItem from "../Taskitem/Taskitem";
import "./Tasklist.css";

const TaskList = ({
  title,
  tasks,
  toggleTask,
  deleteTask
}) => {

  // Group tasks according to date
  const groupedTasks = tasks.reduce((groups, task) => {

    const date = task.date || "No Date";

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(task);

    return groups;

  }, {});


  // Sort dates
  const sortedDates = Object.keys(groupedTasks).sort();


  // Format date
  const formatDate = (date) => {

    if (date === "No Date") {
      return "No Date";
    }

    const taskDate = new Date(`${date}T00:00:00`);

    return taskDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  };


  return (
    <div
      className={
        title === "Completed"
          ? "completed"
          : "pending"
      }
    >

      <h2>
        {title} ({tasks.length})
      </h2>


      {tasks.length === 0 ? (

        <div className="emptyTasks">
          No {title.toLowerCase()} tasks
        </div>

      ) : (

        <div className="dailyTasks">

          {sortedDates.map((date) => (

            <div
              className="dayGroup"
              key={date}
            >

              <div className="dayTitle">
                {formatDate(date)}
              </div>


              <div className="dayTasks">

                {groupedTasks[date].map((task) => (

                  <TaskItem
                    key={task.id}
                    task={task}
                    toggleTask={toggleTask}
                    deleteTask={deleteTask}
                  />

                ))}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default TaskList;