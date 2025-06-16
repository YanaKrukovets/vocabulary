"use client";

// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const Login = () => {
  // State management for form inputs and UI states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Handle form submission and authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make API request to login endpoint
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // Handle successful login
      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/user-info");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add CSS stylesheet */}
      <Head>
        <link rel="stylesheet" href="/css/login.css" />
      </Head>
      <div className="login-container">
        <div className="login-content">
          <div className="login-form-container">
            <div className="login-card">
              <div className="login-header">
                <h1 className="login-title">Welcome back</h1>
                <p className="login-subtitle">Please sign in to your account</p>
              </div>

              <form onSubmit={handleLogin} aria-label="Login form" noValidate>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    aria-required="true"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "error-message" : undefined}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    aria-required="true"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "error-message" : undefined}
                  />
                </div>

                {/* Error message display */}
                {error && (
                  <div
                    className="error-message"
                    role="alert"
                    id="error-message"
                    aria-live="polite"
                  >
                    <p className="error-text">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="login-button"
                  aria-busy={loading}
                  aria-disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="loading-spinner"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              {/* Divider between login and register */}
              <div className="divider">
                <span className="divider-text">Don't have an account?</span>
              </div>

              <button
                onClick={() => router.push("/register")}
                className="secondary-button"
                aria-label="Create new account"
              >
                Create new account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
