"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/login.css" />
      </Head>
      <div className="login-container">
        <div className="login-content">
          <div className="login-form-container">
            <div className="login-card">
              <div className="login-header">
                <h1 className="login-title">Create Account</h1>
                <p className="login-subtitle">Please fill in your details</p>
              </div>

              <form onSubmit={handleSubmit} aria-label="Registration form" noValidate>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    aria-required="true"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "error-message" : undefined}
                  />
                </div>

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
                    value={formData.email}
                    onChange={handleChange}
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    aria-required="true"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "error-message" : undefined}
                  />
                </div>

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
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="divider">
                <span className="divider-text">Already have an account?</span>
              </div>

              <button
                onClick={() => router.push("/login")}
                className="secondary-button"
                aria-label="Sign in to existing account"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
