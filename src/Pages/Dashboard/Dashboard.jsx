import React, { useEffect, useState } from "react";

import Sidebar from "../../Component/Sidebar/Sidebar";
import Header from "../../Component/Header/Header";
import ProgressBar from "../../Component/ProgressBar/ProgressBar";
import TaskInput from "../../Component/Taskinput/Taskinput";
import TaskList from "../../Component/Tasklist/Tasklist";
import PreviousMonth from "../../Component/PreviousMonth/PreviousMonth";

import { supabase } from "../../supabase";
import getCurrentMonth from "../../utils/GetcurrentMonth/Getcurrentmonth";

import toast from "react-hot-toast";

import "./Dashboard.css";

const Dashboard = () => {
  // =========================
  // CURRENT MONTH
  // =========================

  const currentMonth = getCurrentMonth();

  // =========================
  // TASKS
  // =========================

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // CURRENT USER
  // =========================

  const [user, setUser] = useState(null);

  // =========================
  // SELECTED DATE
  // =========================

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // =========================
  // GET LOGGED-IN USER
  // =========================

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Get user error:", error);

        toast.error("Unable to get logged-in user");

        return;
      }

      if (!user) {
        toast.error("Please login first");

        return;
      }

      setUser(user);

      // User milne ke baad tasks load karo
      fetchTasks(user.id);
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    }
  }

  // =========================
  // LOAD USER TASKS
  // =========================

  async function fetchTasks(userId) {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: true });

      if (error) {
        console.error("Supabase fetch error:", error);

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
  // ADD TASK
  // =========================

  async function addTask(text, date) {
    if (!text.trim() || !date) {
      toast.error("Please enter a task");

      return;
    }

    if (!user) {
      toast.error("Please login first");

      return;
    }

    try {
      // =========================
      // CREATE MONTH
      // =========================

      const taskDate = new Date(`${date}T00:00:00`);

      const taskMonth = taskDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      // =========================
      // NEW TASK
      // =========================

      const newTask = {
        user_id: user.id,
        text: text.trim(),
        date: date,
        month: taskMonth,
        completed: false,
      };

      console.log("Adding task:", newTask);

      // =========================
      // INSERT INTO SUPABASE
      // =========================

      const { data, error } = await supabase
        .from("tasks")
        .insert([newTask])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);

        toast.error(error.message || "Task could not be added");

        return;
      }

      // =========================
      // UPDATE LOCAL UI
      // =========================

      setTasks((previousTasks) => [
        ...previousTasks,
        data,
      ]);

      // =========================
      // SELECT TASK DATE
      // =========================

      setSelectedDate(date);

      toast.success("Task Added Successfully 🎉");
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    }
  }

  // =========================
  // TOGGLE TASK
  // =========================

  async function toggleTask(id) {
    try {
      if (!user) {
        toast.error("Please login first");

        return;
      }

      // Find task
      const task = tasks.find(
        (item) => item.id === id
      );

      if (!task) {
        return;
      }

      const newCompleted = !task.completed;

      // =========================
      // UPDATE SUPABASE
      // =========================

      const { data, error } = await supabase
        .from("tasks")
        .update({
          completed: newCompleted,
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error(
          "Supabase update error:",
          error
        );

        toast.error(
          error.message ||
            "Task could not be updated"
        );

        return;
      }

      // =========================
      // UPDATE UI
      // =========================

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
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

      toast.error("Something went wrong");
    }
  }

  // =========================
  // DELETE TASK
  // =========================

  async function deleteTask(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    if (!user) {
      toast.error("Please login first");

      return;
    }

    try {
      // =========================
      // DELETE FROM SUPABASE
      // =========================

      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "Supabase delete error:",
          error
        );

        toast.error(
          error.message ||
            "Task could not be deleted"
        );

        return;
      }

      // =========================
      // UPDATE UI
      // =========================

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task.id !== id
        )
      );

      toast.success(
        "Task deleted successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    }
  }

  // =========================
  // CURRENT MONTH TASKS
  // =========================

  const currentMonthTasks = tasks.filter(
    (task) => task.month === currentMonth
  );

  // =========================
  // SELECTED DATE TASKS
  // =========================

  const selectedDateTasks =
    currentMonthTasks.filter(
      (task) => task.date === selectedDate
    );

  // =========================
  // COMPLETED
  // =========================

  const completed =
    currentMonthTasks.filter(
      (task) => task.completed
    );

  const selectedCompleted =
    selectedDateTasks.filter(
      (task) => task.completed
    );

  // =========================
  // PENDING
  // =========================

  const pending =
    currentMonthTasks.filter(
      (task) => !task.completed
    );

  const selectedPending =
    selectedDateTasks.filter(
      (task) => !task.completed
    );

  // =========================
  // PREVIOUS MONTHS
  // =========================

  const previousMonths = [
    ...new Set(
      tasks
        .map((task) => task.month)
        .filter(
          (month) => month !== currentMonth
        )
    ),
  ].sort((a, b) => {
    return (
      new Date(`1 ${b}`) -
      new Date(`1 ${a}`)
    );
  });

  // =========================
  // DELETE MONTH
  // =========================

  async function deleteMonth(month) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${month}?`
    );

    if (!confirmDelete) {
      return;
    }

    if (!user) {
      toast.error("Please login first");

      return;
    }

    try {
      // =========================
      // DELETE MONTH TASKS
      // =========================

      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("month", month)
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "Delete month error:",
          error
        );

        toast.error(
          error.message ||
            "Could not delete month"
        );

        return;
      }

      // =========================
      // UPDATE UI
      // =========================

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) =>
            task.month !== month
        )
      );

      toast.success(
        `${month} deleted successfully`
      );
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    }
  }

  // =========================
  // SELECTED DATE DISPLAY
  // =========================

  const formattedSelectedDate =
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
      <div className="dashboard">
        <Sidebar />

        <div className="content">
          <Header />

          <div className="loadingTasks">
            Loading tasks...
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // RETURN
  // =========================

  return (
    <div className="dashboard">

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="content">

        {/* =========================
            HEADER
        ========================= */}

        <Header />

        {/* =========================
            CURRENT MONTH
        ========================= */}

        <div className="top">

          <div className="monthInfo">

            <h1>
              {currentMonth}
            </h1>

            <p>
              This month's tasks overview
              and progress
            </p>

            <span className="currentBadge">
              Current Month
            </span>

          </div>

          <ProgressBar
            total={currentMonthTasks.length}
            completed={completed.length}
          />

        </div>

        {/* =========================
            SELECTED DATE
        ========================= */}

        <div className="selectedDateInfo">

          <h2>
            {formattedSelectedDate}
          </h2>

          <p>
            Tasks for selected date
          </p>

        </div>

        {/* =========================
            ADD TASK
        ========================= */}

        <TaskInput
          addTask={addTask}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {/* =========================
            CURRENT MONTH TASKS
        ========================= */}

        <div className="taskContainer">

          {/* COMPLETED */}

          <TaskList
            title="Completed"
            tasks={selectedCompleted}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />

          {/* PENDING */}

          <TaskList
            title="Pending"
            tasks={selectedPending}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />

        </div>

        {/* =========================
            PREVIOUS MONTHS
        ========================= */}

        <div className="previous">

          <div className="previousTitle">

            <h2>
              Previous Months
            </h2>

            <p>
              Your previous monthly tasks
            </p>

          </div>

          {previousMonths.length === 0 ? (

            <div className="noPreviousMonths">

              <p>
                No previous months yet.
              </p>

            </div>

          ) : (

            previousMonths.map(
              (month) => (

                <PreviousMonth
                  key={month}
                  month={month}
                  tasks={tasks.filter(
                    (task) =>
                      task.month === month
                  )}
                  deleteMonth={
                    deleteMonth
                  }
                />

              )
            )

          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;