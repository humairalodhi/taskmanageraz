import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabase";

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("PROTECTED ROUTE SESSION:", session);

      setSession(session);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH EVENT:", event);
      console.log("AUTH SESSION:", session);

      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Session check hone tak
  if (session === undefined) {
    return <div>Checking login...</div>;
  }

  // Agar login nahi hai
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Agar login hai
  return children;
};

export default ProtectedRoute;