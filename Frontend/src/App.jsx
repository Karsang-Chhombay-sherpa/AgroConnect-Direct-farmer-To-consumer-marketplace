import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import VeggieBox from "./components/VeggieBox/VeggieBox";
import Footer from "./components/Footer/Footer";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/SignUp/Login";
import Profile from "./components/Profile/Profile";
import FarmerRegistration from "./components/Hero/naFarmerRegistraion";
import FarmerSignUp from "./components/SignUp/FarmerSignUp";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #d1fae5 0%, #fef3c7 100%)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              color: "#22c55e",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Welcome to your Dashboard!
          </h2>
          <p
            style={{
              color: "#6b7280",
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            Hello, {user.firstName} {user.lastName}!
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Email
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "#22c55e",
                  fontWeight: "600",
                }}
              >
                {user.email}
              </div>
            </div>
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Status
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "#22c55e",
                  fontWeight: "600",
                }}
              >
                {user.verified ? "✓ Verified" : "✗ Not Verified"}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "12px 24px",
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                View Profile
              </button>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: "12px 24px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
            <Link to="/" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "12px 24px",
                  background: "transparent",
                  color: "#22c55e",
                  border: "2px solid #22c55e",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero />
              <Features />
              <VeggieBox />
              <FarmerRegistration />
              <Footer />
            </>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/farmer-signup" element={<FarmerSignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
