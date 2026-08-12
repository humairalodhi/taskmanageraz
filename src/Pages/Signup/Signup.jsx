import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import toast from "react-hot-toast";

import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);

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
          console.error(
            "Session error:",
            error
          );
          return;
        }

        // Already logged in
        if (session && mounted) {
          navigate("/dashboard", {
            replace: true,
          });

          return;
        }
      } catch (error) {
        console.error(
          "Session check error:",
          error
        );
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
  // EMAIL SIGNUP
  // =====================================================

  const handleSignup = async (e) => {
    e.preventDefault();

    // -------------------------
    // Validation
    // -------------------------

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    if (!confirmPassword) {
      toast.error(
        "Please confirm your password"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      // -------------------------
      // Supabase error
      // -------------------------

      if (error) {
        console.error(
          "Signup error:",
          error
        );

        toast.error(error.message);

        return;
      }

      // -------------------------
      // Session created
      // -------------------------

      if (data?.session) {
        toast.success(
          "Account created successfully 🎉"
        );

        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      // -------------------------
      // Email confirmation required
      // -------------------------

      if (data?.user && !data?.session) {
        toast.success(
          "Account created! Please verify your email."
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      // -------------------------
      // Unexpected response
      // -------------------------

      toast.error(
        "Unable to create account. Please try again."
      );
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE SIGNUP
  // =====================================================

  const handleGoogleSignup = async () => {
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
          "Google signup error:",
          error
        );

        toast.error(error.message);

        setGoogleLoading(false);
      }

      // Do not navigate manually.
      //
      // Supabase redirects the user to Google.
      // After successful authentication,
      // Google/Supabase redirects to /dashboard.
    } catch (error) {
      console.error(
        "Google signup error:",
        error
      );

      toast.error(
        "Google signup failed. Please try again."
      );

      setGoogleLoading(false);
    }
  };

  // =====================================================
  // SESSION CHECK LOADING
  // =====================================================

  if (checkingSession) {
    return (
      <div
        className="signupPage"
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
          Checking account...
        </div>
      </div>
    );
  }

  // =====================================================
  // SIGNUP PAGE
  // =====================================================

  return (
    <div className="signupPage">
      <div className="signupCard">

        {/* =========================
            HEADER
        ========================= */}

        <div className="signupHeader">
          <h1>
            Create Account
          </h1>

          <p>
            Create your Task Manager account
          </p>
        </div>

        {/* =========================
            SIGNUP FORM
        ========================= */}

        <form
          onSubmit={handleSignup}
          className="signupForm"
        >

          {/* Name */}

          <div className="formGroup">
            <label htmlFor="signup-name">
              Your Name
            </label>

            <input
              id="signup-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={
                loading || googleLoading
              }
              autoComplete="name"
            />
          </div>

          {/* Email */}

          <div className="formGroup">
            <label htmlFor="signup-email">
              Email
            </label>

            <input
              id="signup-email"
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
            <label htmlFor="signup-password">
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={
                loading || googleLoading
              }
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}

          <div className="formGroup">
            <label htmlFor="signup-confirm-password">
              Confirm Password
            </label>

            <input
              id="signup-confirm-password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              disabled={
                loading || googleLoading
              }
              autoComplete="new-password"
            />
          </div>

          {/* Signup Button */}

          <button
            type="submit"
            className="signupButton"
            disabled={
              loading || googleLoading
            }
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* =========================
            DIVIDER
        ========================= */}

        <div className="divider">
          <span>OR</span>
        </div>

        {/* =========================
            GOOGLE SIGNUP
        ========================= */}

        <button
          type="button"
          className="googleButton"
          onClick={handleGoogleSignup}
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
            LOGIN LINK
        ========================= */}

        <div className="loginLink">
          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;