import React, { useEffect, useState } from "react";

import Sidebar from "../../Component/Sidebar/Sidebar";
import { supabase } from "../../supabase";

import "./Calender.css";

import toast from "react-hot-toast";

const Calender = () => {
  // =========================
  // TASKS FROM SUPABASE
  // =========================

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // CURRENT DATE
  // =========================

  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );

  // =========================
  // CURRENT MONTH / YEAR
  // =========================

  const year = today.getFullYear();
  const month = today.getMonth();

  const currentMonthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // =========================
  // LOAD TASKS
  // =========================

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error(
          "Supabase fetch error:",
          error
        );

        toast.error("Unable to load tasks");
        return;
      }

      setTasks(data || []);
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // FIRST DAY OF MONTH
  // =========================

  const firstDay = new Date(
    year,
    month,
    1
  );

  // =========================
  // LAST DAY OF MONTH
  // =========================

  const lastDay = new Date(
    year,
    month + 1,
    0
  );

  // =========================
  // DAYS
  // =========================

  const daysInMonth =
    lastDay.getDate();

  const startingDay =
    firstDay.getDay();

  // =========================
  // PREVIOUS MONTH
  // =========================

  const previousMonthLastDay =
    new Date(
      year,
      month,
      0
    ).getDate();

  // =========================
  // CALENDAR DAYS
  // =========================

  const calendarDays = [];

  // Previous month dates

  for (
    let i = startingDay - 1;
    i >= 0;
    i--
  ) {
    calendarDays.push({
      day:
        previousMonthLastDay - i,

      currentMonth: false,
    });
  }

  // Current month dates

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    const dateString =
      `${year}-${String(
        month + 1
      ).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

    calendarDays.push({
      day,
      currentMonth: true,
      date: dateString,
    });
  }

  // Next month dates

  let nextDay = 1;

  while (calendarDays.length < 42) {
    calendarDays.push({
      day: nextDay,
      currentMonth: false,
    });

    nextDay++;
  }

  // =========================
  // CURRENT MONTH TASKS
  // =========================

  const currentMonthTasks =
    tasks.filter((task) => {
      if (!task.date) {
        return false;
      }

      return (
        task.date.startsWith(
          `${year}-${String(
            month + 1
          ).padStart(2, "0")}`
        )
      );
    });

  // =========================
  // SELECTED DATE TASKS
  // =========================

  const selectedDateTasks =
    currentMonthTasks.filter(
      (task) =>
        task.date === selectedDate
    );

  // =========================
  // COMPLETED
  // =========================

  const completedTasks =
    selectedDateTasks.filter(
      (task) => task.completed
    );

  // =========================
  // PENDING
  // =========================

  const pendingTasks =
    selectedDateTasks.filter(
      (task) => !task.completed
    );

  // =========================
  // TASKS FOR DATE
  // =========================

  function getDateTasks(date) {
    return currentMonthTasks.filter(
      (task) =>
        task.date === date
    );
  }

  // =========================
  // TOGGLE TASK
  // =========================

  async function toggleTask(id) {
    try {
      const task = tasks.find(
        (item) => item.id === id
      );

      if (!task) {
        return;
      }

      const newCompleted =
        !task.completed;

      const { data, error } =
        await supabase
          .from("tasks")
          .update({
            completed: newCompleted,
          })
          .eq("id", id)
          .select()
          .single();

      if (error) {
        console.error(
          "Supabase update error:",
          error
        );

        toast.error(
          "Task could not be updated"
        );

        return;
      }

      setTasks(
        (previousTasks) =>
          previousTasks.map(
            (item) =>
              item.id === id
                ? data
                : item
          )
      );

      toast.success(
        newCompleted
          ? "Task Completed ✓"
          : "Task marked as pending"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong"
      );
    }
  }

  // =========================
  // DELETE TASK
  // =========================

  async function deleteTask(id) {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const { error } =
        await supabase
          .from("tasks")
          .delete()
          .eq("id", id);

      if (error) {
        console.error(
          "Supabase delete error:",
          error
        );

        toast.error(
          "Task could not be deleted"
        );

        return;
      }

      setTasks(
        (previousTasks) =>
          previousTasks.filter(
            (task) =>
              task.id !== id
          )
      );

      toast.success(
        "Task deleted successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong"
      );
    }
  }

  // =========================
  // FORMATTED DATE
  // =========================

  const formattedDate =
    new Date(
      `${selectedDate}T00:00:00`
    ).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="calendarPage">

        <Sidebar />

        <main className="calendarContent">

          <div className="calendarHeader">

            <h1>
              Calendar
            </h1>

            <p>
              Loading your tasks...
            </p>

          </div>

        </main>

      </div>
    );
  }

  // =========================
  // RETURN
  // =========================

  return (
    <div className="calendarPage">

      <Sidebar />

      <main className="calendarContent">

        {/* HEADER */}

        <div className="calendarHeader">

          <h1>
            Calendar
          </h1>

          <p>
            View and manage your tasks by date
          </p>

        </div>

        {/* CALENDAR */}

        <div className="calendarCard">

          <div className="calendarMonth">

            <h2>
              {currentMonthName}
            </h2>

          </div>

          {/* WEEK DAYS */}

          <div className="weekDays">

            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>

          </div>

          {/* CALENDAR GRID */}

          <div className="calendarGrid">

            {calendarDays.map(
              (calendarDay, index) => {

                if (
                  !calendarDay.currentMonth
                ) {
                  return (
                    <div
                      key={index}
                      className="calendarDay otherMonth"
                    >

                      <span className="dayNumber">
                        {calendarDay.day}
                      </span>

                    </div>
                  );
                }

                const dateTasks =
                  getDateTasks(
                    calendarDay.date
                  );

                const hasCompleted =
                  dateTasks.some(
                    (task) =>
                      task.completed
                  );

                const hasPending =
                  dateTasks.some(
                    (task) =>
                      !task.completed
                  );

                const todayString =
                  today
                    .toISOString()
                    .split("T")[0];

                const isToday =
                  calendarDay.date ===
                  todayString;

                const isSelected =
                  calendarDay.date ===
                  selectedDate;

                return (
                  <div
                    key={index}
                    className={`calendarDay
                      ${
                        isToday
                          ? "today"
                          : ""
                      }
                      ${
                        isSelected
                          ? "selectedDay"
                          : ""
                      }
                    `}
                    onClick={() =>
                      setSelectedDate(
                        calendarDay.date
                      )
                    }
                  >

                    <span className="dayNumber">
                      {calendarDay.day}
                    </span>

                    {/* TASK DOTS */}

                    <div className="taskDots">

                      {hasCompleted && (
                        <span className="completedDot"></span>
                      )}

                      {hasPending && (
                        <span className="pendingDot"></span>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {/* LEGEND */}

          <div className="calendarLegend">

            <div className="legendItem">

              <span className="completedDot"></span>

              Completed

            </div>

            <div className="legendItem">

              <span className="pendingDot"></span>

              Pending

            </div>

          </div>

        </div>

        {/* SELECTED DATE TASKS */}

        <div className="dateTasksCard">

          <div className="dateTasksHeader">

            <h2>
              {formattedDate}
            </h2>

          </div>

          <div className="dateTasksContainer">

            {/* COMPLETED */}

            <div className="dateTaskColumn">

              <h3 className="completedTitle">

                <span className="titleIcon">
                  ✓
                </span>

                Completed (
                {completedTasks.length}
                )

              </h3>

              {completedTasks.length ===
              0 ? (

                <p className="emptyText">
                  No completed tasks.
                </p>

              ) : (

                completedTasks.map(
                  (task) => (

                    <div
                      className="calendarTask completedTask"
                      key={task.id}
                    >

                      <input
                        type="checkbox"
                        checked={
                          task.completed
                        }
                        onChange={() =>
                          toggleTask(
                            task.id
                          )
                        }
                      />

                      <span className="taskText">
                        {task.text}
                      </span>

                      <button
                        className="deleteButton"
                        onClick={() =>
                          deleteTask(
                            task.id
                          )
                        }
                      >
                        🗑
                      </button>

                    </div>

                  )
                )

              )}

            </div>

            {/* PENDING */}

            <div className="dateTaskColumn">

              <h3 className="pendingTitle">

                <span className="titleIcon">
                  ◷
                </span>

                Pending (
                {pendingTasks.length}
                )

              </h3>

              {pendingTasks.length ===
              0 ? (

                <p className="emptyText">
                  No pending tasks.
                </p>

              ) : (

                pendingTasks.map(
                  (task) => (

                    <div
                      className="calendarTask pendingTask"
                      key={task.id}
                    >

                      <input
                        type="checkbox"
                        checked={
                          task.completed
                        }
                        onChange={() =>
                          toggleTask(
                            task.id
                          )
                        }
                      />

                      <span className="taskText">
                        {task.text}
                      </span>

                      <button
                        className="deleteButton"
                        onClick={() =>
                          deleteTask(
                            task.id
                          )
                        }
                      >
                        🗑
                      </button>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Calender;