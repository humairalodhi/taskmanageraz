import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import toast from "react-hot-toast";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // =====================================================
  // CHECK EXISTING SESSION
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          return;
        }

        // User is already logged in
        if (session && mounted) {
          navigate("/dashboard", {
            replace: true,
          });

          return;
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // =====================================================
  // EMAIL LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        console.error("Login error:", error);

        toast.error(error.message);

        return;
      }

      // Login successful
      if (data?.session) {
        toast.success("Login successful 🎉");

        navigate("/dashboard", {
          replace: true,
        });
      } else {
        toast.error(
          "Login failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",

          options: {
            redirectTo:
              `${window.location.origin}/dashboard`,
          },
        });

      if (error) {
        console.error(
          "Google login error:",
          error
        );

        toast.error(error.message);

        setGoogleLoading(false);
      }

      // IMPORTANT:
      // Do NOT navigate manually here.
      //
      // Supabase redirects the user to Google.
      // After Google authentication, Supabase
      // redirects back to /dashboard.
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      toast.error(
        "Google login failed. Please try again."
      );

      setGoogleLoading(false);
    }
  };

  // =====================================================
  // LOADING SCREEN WHILE SESSION IS CHECKED
  // =====================================================

  if (checkingSession) {
    return (
      <div
        className="loginPage"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            color: "#555",
          }}
        >
          Checking login...
        </div>
      </div>
    );
  }

  // =====================================================
  // LOGIN PAGE
  // =====================================================

  return (
    <div className="loginPage">
      <div className="loginCard">

        {/* =========================
            HEADER
        ========================= */}

        <div className="loginHeader">
          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your Task Manager account
          </p>
        </div>

        {/* =========================
            EMAIL LOGIN FORM
        ========================= */}

        <form
          onSubmit={handleLogin}
          className="loginForm"
        >

          {/* Email */}

          <div className="formGroup">
            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={
                loading || googleLoading
              }
              autoComplete="email"
            />
          </div>

          {/* Password */}

          <div className="formGroup">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={
                loading || googleLoading
              }
              autoComplete="current-password"
            />
          </div>

          {/* Login Button */}

          <button
            type="submit"
            className="loginButton"
            disabled={
              loading || googleLoading
            }
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {/* =========================
            DIVIDER
        ========================= */}

        <div className="divider">
          <span>OR</span>
        </div>

        {/* =========================
            GOOGLE LOGIN
        ========================= */}

        <button
          type="button"
          className="googleButton"
          onClick={handleGoogleLogin}
          disabled={
            loading || googleLoading
          }
        >
          {googleLoading ? (
            "Connecting to Google..."
          ) : (
            <>
              <span className="googleIcon">
                G
              </span>

              Continue with Google
            </>
          )}
        </button>

        {/* =========================
            SIGNUP LINK
        ========================= */}

        <div className="signupLink">
          <span>
            Don't have an account?
          </span>

          <Link to="/signup">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;