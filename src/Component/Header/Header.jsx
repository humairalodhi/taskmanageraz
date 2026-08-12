import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import "./Header.css";

import { supabase } from "../../supabase";


const Header = () => {
  const navigate = useNavigate();

  const profileRef = useRef(null);

  const [user, setUser] = useState(null);

  const [profileName, setProfileName] =
    useState("User");

  const [profileImage, setProfileImage] =
    useState("");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);


  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const updateProfile = (currentUser) => {
    if (!currentUser) {
      setProfileName("User");
      setProfileImage("");
      return;
    }

    const metadata =
      currentUser.user_metadata || {};

    // Name from Google or Email Signup
    const name =
      metadata.full_name ||
      metadata.name ||
      metadata.user_name ||
      currentUser.email?.split("@")[0] ||
      "User";

    setProfileName(name);

    // Google profile picture
    const avatar =
      metadata.avatar_url ||
      metadata.picture ||
      "";

    setProfileImage(avatar);
  };


  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(
          "User error:",
          error
        );

        return;
      }

      if (!mounted) return;

      if (user) {
        setUser(user);
        updateProfile(user);
      } else {
        setUser(null);
        setProfileName("User");
        setProfileImage("");
      }
    };

    loadUser();


    // ==========================================
    // AUTH STATE LISTENER
    // ==========================================

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!mounted) return;

          if (session?.user) {
            setUser(session.user);

            updateProfile(
              session.user
            );
          } else {
            setUser(null);

            setProfileName("User");

            setProfileImage("");

            setMenuOpen(false);
          }
        }
      );


    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, []);


  // ==========================================
  // CLOSE MENU ON OUTSIDE CLICK
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setMenuOpen(false);
      }
    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  // ==========================================
  // INITIALS
  // ==========================================

  const initials =
    profileName
      .trim()
      .split(/\s+/)
      .map(
        (word) => word[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    if (
      logoutLoading ||
      deleteLoading
    ) {
      return;
    }

    try {
      setLogoutLoading(true);


      const { error } =
        await supabase.auth.signOut();


      if (error) {
        console.error(
          "Logout error:",
          error
        );

        toast.error(
          error.message ||
            "Unable to logout"
        );

        return;
      }


      // Clear UI
      setMenuOpen(false);

      setUser(null);

      setProfileName("User");

      setProfileImage("");


      toast.success(
        "Logged out successfully"
      );


      // Go to Login
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      toast.error(
        "Something went wrong while logging out"
      );
    } finally {
      setLogoutLoading(false);
    }
  };


  // ==========================================
  // DELETE ACCOUNT
  // ==========================================

  const handleDeleteAccount =
    async () => {
      if (
        logoutLoading ||
        deleteLoading
      ) {
        return;
      }


      // First confirmation
      const confirmed =
        window.confirm(
          "Are you sure you want to delete your account?"
        );


      if (!confirmed) {
        return;
      }


      // Second confirmation
      const secondConfirmed =
        window.confirm(
          "This will permanently delete your account. This action cannot be undone. Continue?"
        );


      if (!secondConfirmed) {
        return;
      }


      try {
        setDeleteLoading(true);


        // ==========================================
        // CHECK SESSION
        // ==========================================

        const {
          data: { session },
          error: sessionError,
        } =
          await supabase.auth.getSession();


        if (
          sessionError ||
          !session
        ) {
          toast.error(
            "Session expired. Please login again."
          );


          await supabase.auth.signOut();


          navigate("/login", {
            replace: true,
          });


          return;
        }


        console.log(
          "Deleting account for:",
          session.user.email
        );

// ==========================================
// CALL EDGE FUNCTION
// ==========================================

const { data, error } =
  await supabase.functions.invoke(
    "rapid-endpoint"
  );

console.log("Delete response:", data);
console.log("Delete error:", error);

if (error) {
  console.error(
    "Delete account error:",
    error
  );

  toast.error(
    error.message ||
      "Account deletion failed"
  );

  return;
}

if (data?.error) {
  console.error(
    "Server delete error:",
    data.error
  );

  toast.error(data.error);

  return;
}

// ==========================================
// DELETE SUCCESS
// ==========================================

console.log(
  "Account deleted successfully"
);

// Clear local tasks
localStorage.removeItem(
  "monthlyTasks"
);

// Sign out local session
await supabase.auth.signOut();

// Clear UI
setUser(null);
setProfileName("User");
setProfileImage("");
setMenuOpen(false);

toast.success(
  "Account deleted successfully"
);

// Go to login
setTimeout(() => {
  navigate("/login", {
    replace: true,
  });
}, 500);

        // ==========================================
        // SERVER ERROR
        // ==========================================

        if (data?.error) {
          console.error(
            "Server delete error:",
            data.error
          );


          toast.error(
            data.error
          );


          return;
        }


        // ==========================================
        // DELETE SUCCESS
        // ==========================================

        console.log(
          "Account deleted successfully"
        );


        // Remove local task data
        // Change/add keys here if your app
        // uses other localStorage keys.
        localStorage.removeItem(
          "monthlyTasks"
        );


        // Clear local auth session
        await supabase.auth.signOut();


        // Clear UI
        setUser(null);

        setProfileName("User");

        setProfileImage("");

        setMenuOpen(false);


        toast.success(
          "Account deleted successfully"
        );


        // ==========================================
        // GO TO LOGIN
        // ==========================================

        setTimeout(() => {
          navigate("/login", {
            replace: true,
          });
        }, 500);


      } catch (error) {
        console.error(
          "Delete account error:",
          error
        );


        toast.error(
          error?.message ||
            "Unable to delete account"
        );
      } finally {
        setDeleteLoading(false);
      }
    };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="header">

      <h2>
        Monthly Task Manager
      </h2>


      <div
        className="profileWrapper"
        ref={profileRef}
      >

        {/* PROFILE BUTTON */}

        <button
          type="button"
          className="profile"
          onClick={() =>
            setMenuOpen(
              (previous) =>
                !previous
            )
          }
          aria-label="Open profile menu"
        >

          {profileImage ? (
            <img
              src={profileImage}
              alt={profileName}
              className="profileImage"
              onError={() => {
                setProfileImage("");
              }}
            />
          ) : (
            initials
          )}

        </button>


        {/* PROFILE MENU */}

        {menuOpen && (
          <div className="profileMenu">

            {/* USER INFORMATION */}

            <div className="profileInfo">

              <div className="profileLarge">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={profileName}
                    className="profileLargeImage"
                    onError={() => {
                      setProfileImage("");
                    }}
                  />
                ) : (
                  initials
                )}

              </div>


              <div className="profileDetails">

                <strong>
                  {profileName}
                </strong>

                <span>
                  {user?.email ||
                    "No email"}
                </span>

              </div>

            </div>


            <div className="profileDivider" />


            {/* LOGOUT */}

            <button
              type="button"
              className="profileMenuItem logoutItem"
              onClick={handleLogout}
              disabled={
                logoutLoading ||
                deleteLoading
              }
            >

              {logoutLoading
                ? "Logging out..."
                : "Logout"}

            </button>


            {/* DELETE ACCOUNT */}
{/* 
            <button
              type="button"
              className="profileMenuItem deleteItem"
              onClick={
                handleDeleteAccount
              }
              disabled={
                logoutLoading ||
                deleteLoading
              }
            >

              {deleteLoading
                ? "Deleting account..."
                : "Delete Account"}

            </button> */}

          </div>
        )}

      </div>

    </div>
  );
};


export default Header;