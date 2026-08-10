import React, { useMemo } from "react";
import "./TaskCalender.css";

const TaskCalendar = ({
  selectedDate,
  setSelectedDate,
  tasks = [],
}) => {

  // =========================
  // CURRENT DATE
  // =========================

  const currentDate = new Date();

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();


  // =========================
  // DAYS IN CURRENT MONTH
  // =========================

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();


  // =========================
  // FIRST DAY OF CURRENT MONTH
  // =========================

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();


  // =========================
  // MONDAY AS FIRST DAY
  // =========================

  const startingDay =
    firstDay === 0
      ? 6
      : firstDay - 1;


  // =========================
  // CREATE CALENDAR DAYS
  // =========================

  const calendarDays = useMemo(() => {

    const days = [];


    // Empty spaces before first day

    for (
      let i = 0;
      i < startingDay;
      i++
    ) {

      days.push(null);

    }


    // Actual days

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {

      days.push(day);

    }


    return days;

  }, [startingDay, daysInMonth]);


  // =========================
  // CREATE DATE STRING
  // =========================

  const getDateString = (day) => {

    if (!day) return "";


    const monthNumber = String(
      month + 1
    ).padStart(2, "0");


    const dayNumber = String(day)
      .padStart(2, "0");


    return `${year}-${monthNumber}-${dayNumber}`;

  };


  // =========================
  // CHECK TASKS
  // =========================

  const hasTasks = (day) => {

    if (!day) return false;


    const date = getDateString(day);


    return tasks.some(
      (task) => task.date === date
    );

  };


  // =========================
  // RETURN
  // =========================

  return (

    <div className="taskCalendar">


      {/* =========================
          CALENDAR HEADER
      ========================= */}

      <div className="calendarHeader">

        <div>

          <h2>

            {currentDate.toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              }
            )}

          </h2>


          <p>
            Select a date to view tasks
          </p>

        </div>

      </div>


      {/* =========================
          WEEK DAYS
      ========================= */}

      <div className="calendarWeek">

        {[
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
        ].map((day) => (

          <div
            className="weekDay"
            key={day}
          >

            {day}

          </div>

        ))}

      </div>


      {/* =========================
          CALENDAR DAYS
      ========================= */}

      <div className="calendarDays">

        {calendarDays.map(
          (day, index) => {

            const date =
              getDateString(day);


            const isSelected =
              date === selectedDate;


            const taskExists =
              hasTasks(day);


            return (

              <button

                key={index}

                type="button"

                className={`calendarDay ${
                  isSelected
                    ? "selectedDay"
                    : ""
                } ${
                  taskExists
                    ? "hasTasks"
                    : ""
                }`}

                disabled={!day}

                onClick={() => {

                  if (day) {

                    setSelectedDate(date);

                  }

                }}

              >

                {day && (

                  <>

                    <span>
                      {day}
                    </span>


                    {taskExists && (
                      <small></small>
                    )}

                  </>

                )}

              </button>

            );

          }
        )}

      </div>


    </div>

  );

};


export default TaskCalendar;