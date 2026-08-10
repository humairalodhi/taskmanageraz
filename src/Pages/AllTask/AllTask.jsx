import React, { useEffect, useMemo, useState } from "react";
import "./AllTask.css";

import Sidebar from "../../Component/Sidebar/Sidebar";
import { supabase } from "../../supabase";

import toast from "react-hot-toast";

const AllTask = () => {
  // =========================
  // TASKS FROM SUPABASE
  // =========================

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FILTER STATES
  // =========================

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");

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
  // FILTER TASKS
  // =========================

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Month filter
      if (
        selectedMonth !== "all" &&
        task.month !== selectedMonth
      ) {
        return false;
      }

      // Status filter
      if (
        selectedStatus === "completed" &&
        !task.completed
      ) {
        return false;
      }

      if (
        selectedStatus === "pending" &&
        task.completed
      ) {
        return false;
      }

      // Search
      if (
        search.trim() &&
        !task.text
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [
    tasks,
    selectedMonth,
    selectedStatus,
    search,
  ]);

  // =========================
  // TOGGLE TASK
  // =========================

  async function toggleTask(taskId) {
    try {
      const task = tasks.find(
        (item) => item.id === taskId
      );

      if (!task) {
        return;
      }

      const newCompleted = !task.completed;

      const { data, error } = await supabase
        .from("tasks")
        .update({
          completed: newCompleted,
        })
        .eq("id", taskId)
        .select()
        .single();

      if (error) {
        console.error(
          "Supabase update error:",
          error
        );

        toast.error("Task could not be updated");
        return;
      }

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item.id === taskId ? data : item
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

  async function deleteTask(taskId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      toast("Delete cancelled");
      return;
    }

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) {
        console.error(
          "Supabase delete error:",
          error
        );

        toast.error("Task could not be deleted");
        return;
      }

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task.id !== taskId
        )
      );

      toast.success(
        "Task Deleted Successfully 🗑️"
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  // =========================
  // MONTH LIST
  // =========================

  const monthList = [
    ...new Set(
      tasks.map((task) => task.month)
    ),
  ];

  // =========================
  // COUNTS
  // =========================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="allTasksPage">
        <Sidebar />

        <main className="allTasksContent">
          <div className="allTasksHeader">
            <h1>All Tasks</h1>
            <p>Loading your tasks...</p>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // RETURN
  // =========================

  return (
    <div className="allTasksPage">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <main className="allTasksContent">

        {/* HEADER */}

        <div className="allTasksHeader">
          <h1>
            All Tasks
          </h1>

          <p>
            View and manage all your tasks
          </p>
        </div>

        {/* SUMMARY */}

        <div className="taskSummary">

          {/* TOTAL */}

          <div className="summaryBox">
            <span>
              Total Tasks
            </span>

            <strong>
              {totalTasks}
            </strong>
          </div>

          {/* COMPLETED */}

          <div className="summaryBox">
            <span>
              Completed
            </span>

            <strong>
              {completedTasks}
            </strong>
          </div>

          {/* PENDING */}

          <div className="summaryBox">
            <span>
              Pending
            </span>

            <strong>
              {pendingTasks}
            </strong>
          </div>

        </div>

        {/* FILTERS */}

        <div className="taskFilters">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {/* MONTH */}

          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
          >
            <option value="all">
              All Months
            </option>

            {monthList.map((month) => (
              <option
                value={month}
                key={month}
              >
                {month}
              </option>
            ))}
          </select>

          {/* STATUS */}

          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="pending">
              Pending
            </option>
          </select>

        </div>

        {/* TASK LIST */}

        <div className="allTasksList">

          {filteredTasks.length === 0 ? (

            <div className="noTasks">

              <h3>
                No tasks found
              </h3>

              <p>
                Try changing your filters
                or add a new task.
              </p>

            </div>

          ) : (

            filteredTasks.map((task) => (

              <div
                className="allTaskCard"
                key={task.id}
              >

                {/* CHECKBOX */}

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    toggleTask(task.id)
                  }
                />

                {/* TASK INFO */}

                <div className="allTaskInfo">

                  <h3
                    className={
                      task.completed
                        ? "completedText"
                        : ""
                    }
                  >
                    {task.text}
                  </h3>

                  <div className="taskMeta">

                    <span>
                      {task.month}
                    </span>

                    <span>
                      {task.date}
                    </span>

                  </div>

                </div>

                {/* STATUS */}

                <span
                  className={
                    task.completed
                      ? "status completedStatus"
                      : "status pendingStatus"
                  }
                >
                  {task.completed
                    ? "Completed"
                    : "Pending"}
                </span>

                {/* DELETE */}

                <button
                  className="deleteTaskButton"
                  onClick={() =>
                    deleteTask(task.id)
                  }
                >
                  🗑
                </button>

              </div>

            ))

          )}

        </div>

      </main>

    </div>
  );
};

export default AllTask;