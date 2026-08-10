import React, { useEffect, useMemo, useState } from "react";
import "./Stat.css";

import Sidebar from "../../Component/Sidebar/Sidebar";
import { supabase } from "../../supabase";
import getCurrentMonth from "../../utils/GetcurrentMonth/Getcurrentmonth";

import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaCalendarAlt,
  FaListAlt,
  FaHourglassHalf,
} from "react-icons/fa";

const Stats = () => {
  // =========================
  // TASKS FROM SUPABASE
  // =========================

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // CURRENT MONTH
  // =========================

  const currentMonth = getCurrentMonth();

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

        return;
      }

      setTasks(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // CURRENT MONTH TASKS
  // =========================

  const currentMonthTasks = tasks.filter(
    (task) =>
      task.month === currentMonth
  );

  // =========================
  // TOTAL
  // =========================

  const totalTasks = tasks.length;

  // =========================
  // COMPLETED
  // =========================

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  // =========================
  // PENDING
  // =========================

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  // =========================
  // COMPLETION RATE
  // =========================

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  // =========================
  // CURRENT MONTH COMPLETED
  // =========================

  const currentCompleted =
    currentMonthTasks.filter(
      (task) => task.completed
    ).length;

  // =========================
  // CURRENT MONTH PENDING
  // =========================

  const currentPending =
    currentMonthTasks.filter(
      (task) => !task.completed
    ).length;

  // =========================
  // CURRENT MONTH PROGRESS
  // =========================

  const currentMonthPercentage =
    currentMonthTasks.length === 0
      ? 0
      : Math.round(
          (currentCompleted /
            currentMonthTasks.length) *
            100
        );

  // =========================
  // MONTHLY STATISTICS
  // =========================

  const monthlyStats = useMemo(() => {
    const months = [
      ...new Set(
        tasks.map(
          (task) => task.month
        )
      ),
    ];

    return months
      .sort((a, b) => {
        return (
          new Date(`1 ${b}`) -
          new Date(`1 ${a}`)
        );
      })
      .map((month) => {
        const monthTasks =
          tasks.filter(
            (task) =>
              task.month === month
          );

        const total =
          monthTasks.length;

        const completed =
          monthTasks.filter(
            (task) =>
              task.completed
          ).length;

        const pending =
          monthTasks.filter(
            (task) =>
              !task.completed
          ).length;

        const percentage =
          total === 0
            ? 0
            : Math.round(
                (completed / total) *
                  100
              );

        return {
          month,
          total,
          completed,
          pending,
          percentage,
        };
      });
  }, [tasks]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="statsPage">

        <Sidebar />

        <main className="statsContent">

          <div className="statsHeader">

            <div className="statsHeaderIcon">
              <FaChartLine />
            </div>

            <div>
              <h1>
                Statistics
              </h1>

              <p>
                Loading your statistics...
              </p>
            </div>

          </div>

        </main>

      </div>
    );
  }

  // =========================
  // RETURN
  // =========================

  return (
    <div className="statsPage">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <main className="statsContent">

        {/* HEADER */}

        <div className="statsHeader">

          <div className="statsHeaderIcon">
            <FaChartLine />
          </div>

          <div>

            <h1>
              Statistics
            </h1>

            <p>
              Track your task progress and
              productivity
            </p>

          </div>

        </div>

        {/* OVERVIEW CARDS */}

        <div className="statsCards">

          {/* TOTAL */}

          <div className="statsCard">

            <div className="statsCardIcon totalIcon">
              <FaTasks />
            </div>

            <div className="statsCardContent">

              <span>
                Total Tasks
              </span>

              <strong>
                {totalTasks}
              </strong>

              <small>
                All your tasks
              </small>

            </div>

          </div>

          {/* COMPLETED */}

          <div className="statsCard">

            <div className="statsCardIcon completedIcon">
              <FaCheckCircle />
            </div>

            <div className="statsCardContent">

              <span>
                Completed
              </span>

              <strong>
                {completedTasks}
              </strong>

              <small>
                Tasks completed
              </small>

            </div>

          </div>

          {/* PENDING */}

          <div className="statsCard">

            <div className="statsCardIcon pendingIcon">
              <FaClock />
            </div>

            <div className="statsCardContent">

              <span>
                Pending
              </span>

              <strong>
                {pendingTasks}
              </strong>

              <small>
                Tasks remaining
              </small>

            </div>

          </div>

          {/* COMPLETION RATE */}

          <div className="statsCard">

            <div className="statsCardIcon rateIcon">
              <FaChartLine />
            </div>

            <div className="statsCardContent">

              <span>
                Completion Rate
              </span>

              <strong>
                {completionRate}%
              </strong>

              <small>
                Overall progress
              </small>

            </div>

          </div>

        </div>

        {/* CURRENT MONTH */}

        <section className="currentMonthStats">

          <div className="sectionHeader">

            <div className="sectionHeaderTitle">

              <div className="sectionIcon">
                <FaCalendarAlt />
              </div>

              <div>

                <h2>
                  {currentMonth}
                </h2>

                <p>
                  Current month progress
                </p>

              </div>

            </div>

          </div>

          <div className="currentMonthNumbers">

            {/* TOTAL */}

            <div className="monthNumberBox">

              <div className="numberIcon">
                <FaListAlt />
              </div>

              <div>

                <span>
                  Total
                </span>

                <strong>
                  {currentMonthTasks.length}
                </strong>

              </div>

            </div>

            {/* COMPLETED */}

            <div className="monthNumberBox completedBox">

              <div className="numberIcon">
                <FaCheckCircle />
              </div>

              <div>

                <span>
                  Completed
                </span>

                <strong>
                  {currentCompleted}
                </strong>

              </div>

            </div>

            {/* PENDING */}

            <div className="monthNumberBox pendingBox">

              <div className="numberIcon">
                <FaHourglassHalf />
              </div>

              <div>

                <span>
                  Pending
                </span>

                <strong>
                  {currentPending}
                </strong>

              </div>

            </div>

          </div>

          {/* PROGRESS */}

          <div className="statsProgress">

            <div className="progressTop">

              <span>
                Monthly Progress
              </span>

              <strong>
                {currentMonthPercentage}%
              </strong>

            </div>

            <div className="progressTrack">

              <div
                className="progressFill"
                style={{
                  width:
                    `${currentMonthPercentage}%`,
                }}
              ></div>

            </div>

          </div>

        </section>

        {/* MONTHLY STATISTICS */}

        <section className="monthlyStats">

          <div className="sectionHeader">

            <div className="sectionHeaderTitle">

              <div className="sectionIcon">
                <FaCalendarAlt />
              </div>

              <div>

                <h2>
                  Monthly Progress
                </h2>

                <p>
                  Your task performance by month
                </p>

              </div>

            </div>

          </div>

          {monthlyStats.length === 0 ? (

            <div className="emptyStats">

              <FaTasks />

              <h3>
                No statistics available
              </h3>

              <p>
                Add some tasks to see your
                progress here.
              </p>

            </div>

          ) : (

            <div className="monthlyList">

              {monthlyStats.map(
                (item) => (

                  <div
                    className="monthlyRow"
                    key={item.month}
                  >

                    {/* MONTH */}

                    <div className="monthlyName">

                      <div className="monthlyIcon">
                        <FaCalendarAlt />
                      </div>

                      <div>

                        <strong>
                          {item.month}
                        </strong>

                        <span>
                          {item.total} tasks
                        </span>

                      </div>

                    </div>

                    {/* PROGRESS */}

                    <div className="monthlyProgress">

                      <div className="monthlyProgressTrack">

                        <div
                          className="monthlyProgressFill"
                          style={{
                            width:
                              `${item.percentage}%`,
                          }}
                        ></div>

                      </div>

                    </div>

                    {/* COMPLETED */}

                    <div className="monthlyCompleted">

                      <span>
                        Completed
                      </span>

                      <strong>
                        {item.completed}
                      </strong>

                    </div>

                    {/* PENDING */}

                    <div className="monthlyPending">

                      <span>
                        Pending
                      </span>

                      <strong>
                        {item.pending}
                      </strong>

                    </div>

                    {/* PERCENTAGE */}

                    <div className="monthlyPercentage">

                      <strong>
                        {item.percentage}%
                      </strong>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default Stats;