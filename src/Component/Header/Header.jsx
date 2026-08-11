import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">

      <Link to="/login" className="headerTitle">
        Monthly Task Manager
      </Link>

      <div className="profile">
        HM
      </div>

    </div>
  );
};

export default Header;