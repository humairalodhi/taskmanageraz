import React, { useEffect, useState } from "react";
import "./Header.css";
import { supabase } from "../../supabase";

const Header = () => {
  const [profileName, setProfileName] = useState("User");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("User error:", error);
        return;
      }

      if (data?.user) {
        const name = data.user.user_metadata?.name;

        if (name) {
          setProfileName(name);
        } else if (data.user.email) {
          setProfileName(data.user.email.split("@")[0]);
        }
      }
    };

    getUser();
  }, []);

  // Get first 2 letters for profile circle
  const initials = profileName
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="header">

      <h2>Monthly Task Manager</h2>

      <div className="profile">
        {initials}
      </div>

    </div>
  );
};

export default Header;