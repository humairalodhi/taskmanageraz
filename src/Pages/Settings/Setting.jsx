// ```jsx
import React, { useState } from "react";

import Sidebar from "../../Component/Sidebar/Sidebar";
import useLocalStorage from "../../Hooks/Localhost";
import { supabase } from "../../supabase";

import "./Setting.css";

import ThemeToggle from "../../Component/ThemeToggle/ThemeToggle";
import toast from "react-hot-toast";

const Setting = () => {

  // =========================
  // SETTINGS STORAGE
  // =========================

  const [settings, setSettings] = useLocalStorage(
    "taskSettings",
    {
      name: "",
      showCompleted: true,
      confirmDelete: true,
    }
  );

  // =========================
  // LOCAL STATES
  // =========================

  const [name, setName] = useState(
    settings.name || ""
  );

  const [showCompleted, setShowCompleted] =
    useState(settings.showCompleted);

  const [confirmDelete, setConfirmDelete] =
    useState(settings.confirmDelete);

  // =========================
  // SAVE SETTINGS
  // =========================

  const saveSettings = () => {

    setSettings({
      ...settings,
      name: name.trim(),
      showCompleted,
      confirmDelete,
    });

    toast.success("Settings Saved ✅");
  };

  // =========================
  // CLEAR ALL TASKS
  // =========================

  const clearAllTasks = async () => {

    const confirmClear = window.confirm(
      "Are you sure you want to delete ALL tasks?"
    );

    if (!confirmClear) {
      return;
    }

    try {

      // =========================
      // DELETE ALL TASKS
      // =========================

      const { error } = await supabase
        .from("tasks")
        .delete()
        .not("id", "is", null);

      if (error) {

        console.error(
          "Supabase delete all error:",
          error
        );

        toast.error(
          "Could not delete tasks"
        );

        return;
      }

      // =========================
      // REMOVE OLD LOCAL STORAGE
      // =========================

      localStorage.removeItem("monthlyTasks");

      // =========================
      // SUCCESS
      // =========================

      toast.success(
        "All Tasks Deleted 🗑️"
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {

      console.error(error);

      toast.error(
        "Something went wrong"
      );
    }
  };

  return (
    <div className="settingsPage">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <main className="settingsContent">

        <div className="settingsHeader">

          <h1>
            Settings
          </h1>

          <p>
            Manage your task application settings
          </p>

        </div>

        {/* GENERAL SETTINGS */}

        <section className="settingsSection">

          <div className="settingsSectionHeader">

            <h2>
              General Settings
            </h2>

            <p>
              Customize your basic information
            </p>

          </div>

          <div className="settingItem">

            <label>
              Your Name
            </label>

            <input
              type="text"
              value={name}
              placeholder="Enter your name"
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

          <button
            className="saveButton"
            onClick={saveSettings}
          >
            Save Changes
          </button>

        </section>

        {/* TASK SETTINGS */}

        <section className="settingsSection">

          <div className="settingsSectionHeader">

            <h2>
              Task Settings
            </h2>

          </div>

          <div className="settingToggle">

            <div>

              <h3>
                Show Completed Tasks
              </h3>

              <p>
                Display completed tasks.
              </p>

            </div>

            <label className="switch">

              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) =>
                  setShowCompleted(
                    e.target.checked
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>

          <div className="settingToggle">

            <div>

              <h3>
                Confirm Before Delete
              </h3>

              <p>
                Ask before deleting tasks.
              </p>

            </div>

            <label className="switch">

              <input
                type="checkbox"
                checked={confirmDelete}
                onChange={(e) =>
                  setConfirmDelete(
                    e.target.checked
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>

          <button
            className="saveButton"
            onClick={saveSettings}
          >
            Save Task Settings
          </button>

        </section>

        {/* APPEARANCE */}

        <section className="settingsSection">

          <div className="settingsSectionHeader">

            <h2>
              Appearance
            </h2>

          </div>

          <div className="appearanceInfo">

            <div>

              <h3>
                Theme
              </h3>

            </div>

            <ThemeToggle />

          </div>

        </section>

        {/* DATA */}

        <section className="settingsSection dangerSection">

          <div className="settingsSectionHeader">

            <h2>
              Data
            </h2>

          </div>

          <div className="dangerItem">

            <div>

              <h3>
                Clear All Tasks
              </h3>

              <p>
                Permanently remove all tasks.
              </p>

            </div>

            <button
              className="clearButton"
              onClick={clearAllTasks}
            >
              Clear All Tasks
            </button>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Setting;

