import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// =========================================
// CREATE CONTEXT
// =========================================

const ThemeContext = createContext();

// =========================================
// THEME PROVIDER
// =========================================

export const ThemeProvider = ({ children }) => {

  // =========================================
  // GET SAVED THEME
  // =========================================

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("taskTheme");
    return savedTheme || "light";
  });

  // =========================================
  // SAVE THEME
  // =========================================

  useEffect(() => {
    localStorage.setItem("taskTheme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // =========================================
  // TOGGLE THEME
  // =========================================

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  // =========================================
  // RETURN
  // =========================================

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// =========================================
// CUSTOM HOOK
// =========================================

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};