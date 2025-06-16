"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const UserInfo = () => {
  const [newWord, setNewWord] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ message: "", field: null });
  const router = useRouter();

  const handleWordChange = (e) => {
    setNewWord(e.target.value);
    setError({ message: "", field: null });
  };

  const handleTranslationChange = (e) => {
    setNewTranslation(e.target.value);
    setError({ message: "", field: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ message: "", field: null });

    if (!newWord || !newTranslation) {
      setError({ 
        message: "Please enter both a word and its translation.", 
        field: !newWord ? "word" : "translation" 
      });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/user-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ word: newWord, translation: newTranslation }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewWord("");
        setNewTranslation("");
        router.push("/vocabulary"); // Redirect to vocabulary page after successful addition
      } else {
        setError({ message: data.error || "Something went wrong", field: null });
      }
    } catch (error) {
      console.error("Error adding vocabulary:", error);
      setError({ message: "Error adding vocabulary.", field: null });
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
                <h1 className="login-title">Add New Word</h1>
                <p className="login-subtitle">Add a new word to your vocabulary</p>
              </div>

              {error.message && (
                <div
                  className="error-message"
                  role="alert"
                  id="error-message"
                  aria-live="polite"
                >
                  <p className="error-text">{error.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} aria-label="Add vocabulary form" noValidate>
                <div className="form-group">
                  <label htmlFor="word" className="form-label">
                    Word
                  </label>
                  <input
                    id="word"
                    type="text"
                    placeholder="Enter a word"
                    value={newWord}
                    onChange={handleWordChange}
                    className="form-input"
                    required
                    aria-required="true"
                    aria-invalid={error.field === "word" ? "true" : "false"}
                    aria-describedby={error.field === "word" ? "error-message" : undefined}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="translation" className="form-label">
                    Translation
                  </label>
                  <input
                    id="translation"
                    type="text"
                    placeholder="Enter translation"
                    value={newTranslation}
                    onChange={handleTranslationChange}
                    className="form-input"
                    required
                    aria-required="true"
                    aria-invalid={error.field === "translation" ? "true" : "false"}
                    aria-describedby={error.field === "translation" ? "error-message" : undefined}
                  />
                </div>

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
                      <span>Adding...</span>
                    </div>
                  ) : (
                    "Add Vocabulary"
                  )}
                </button>
              </form>

              <div className="divider">
                <span className="divider-text">View your vocabulary</span>
              </div>

              <button
                onClick={() => router.push("/vocabulary")}
                className="secondary-button"
                aria-label="View your vocabulary list"
              >
                Your Vocabulary
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
