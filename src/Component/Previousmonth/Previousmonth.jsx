import React from "react";
import "./PreviousMonth.css";


const PreviousMonth = ({
  month,
  tasks = [],
  deleteMonth,
}) => {


  // =========================
  // COMPLETED
  // =========================

  const completed =
    tasks.filter(
      (task) => task.completed
    );


  // =========================
  // PENDING
  // =========================

  const pending =
    tasks.filter(
      (task) => !task.completed
    );


  return (

    <div className="previousMonth">


      {/* =========================
          HEADER
      ========================= */}

      <div className="previousMonthHeader">

        <div>

          <h3>
            {month}
          </h3>

          <p>
            Previous Month
          </p>

        </div>


        <button

          className="deleteMonthButton"

          onClick={() =>
            deleteMonth(month)
          }

        >
          Delete

        </button>

      </div>


      {/* =========================
          STATS
      ========================= */}

      <div className="previousMonthStats">


        <div className="monthStat">

          <span>
            Total
          </span>

          <strong>
            {tasks.length}
          </strong>

        </div>


        <div className="monthStat">

          <span>
            Completed
          </span>

          <strong>
            {completed.length}
          </strong>

        </div>


        <div className="monthStat">

          <span>
            Pending
          </span>

          <strong>
            {pending.length}
          </strong>

        </div>


      </div>


      {/* =========================
          TASK LIST
      ========================= */}

      <div className="previousTaskList">


        {tasks.length === 0 ? (

          <p>
            No tasks in this month.
          </p>

        ) : (

          tasks.map(
            (task) => (

              <div

                className="previousTask"

                key={task.id}

              >


                <span

                  className={
                    task.completed
                      ? "taskCompleted"
                      : "taskPending"
                  }

                >

                  {task.completed
                    ? "✓"
                    : "○"}

                </span>


                <div className="previousTaskInfo">


                  <span>
                    {task.text}
                  </span>


                  <small>
                    {task.date}
                  </small>


                </div>


              </div>

            )
          )

        )}

      </div>


    </div>

  );

};


export default PreviousMonth;