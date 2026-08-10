import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../Context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`themeToggle ${theme === "dark" ? "dark" : ""}`}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      <span className="themeIcon">
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </span>

      <span className="themeText">
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;