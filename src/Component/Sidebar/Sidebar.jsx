import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaTasks,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">

      {/* Logo / Title */}
      <h2>Monthly Task</h2>

      <ul>

        {/* Dashboard */}
        <li>
  <NavLink
    to="/dashboard"
    className={({ isActive }) =>
      isActive ? "activeLink" : ""
    }
  >
    <FaHome className="sidebarIcon" />
    <span>Dashboard</span>
  </NavLink>
</li>

        {/* All Tasks */}
        <li>
          <NavLink
            to="/all-tasks"
            className={({ isActive }) =>
              isActive ? "activeLink" : ""
            }
          >
            <FaTasks className="sidebarIcon" />
            <span>All Tasks</span>
          </NavLink>
        </li>

        {/* Calendar */}
        <li>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              isActive ? "activeLink" : ""
            }
          >
            <FaCalendarAlt className="sidebarIcon" />
            <span>Calendar</span>
          </NavLink>
        </li>

        {/* Stats */}
        <li>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              isActive ? "activeLink" : ""
            }
          >
            <FaChartBar className="sidebarIcon" />
            <span>Stats</span>
          </NavLink>
        </li>

        {/* Settings */}
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "activeLink" : ""
            }
          >
            <FaCog className="sidebarIcon" />
            <span>Settings</span>
          </NavLink>
        </li>

      </ul>

    </div>
  );
};

export default Sidebar;