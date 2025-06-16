"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const Vocabulary = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ message: "", field: null });
  const router = useRouter();

  useEffect(() => {
    const fetchVocabulary = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError({ message: "You must be logged in to view vocabulary.", field: null });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVocabulary(data.vocabulary);
          setFilteredVocabulary(data.vocabulary);
        } else {
          setError({ message: "Failed to fetch vocabulary.", field: null });
        }
      } catch (error) {
        console.error("Error fetching vocabulary:", error);
        setError({ message: "Error fetching vocabulary.", field: null });
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  useEffect(() => {
    const filtered = vocabulary.filter(
      (item) =>
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.translation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVocabulary(filtered);
  }, [searchTerm, vocabulary]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (index) => {
    if (!confirm("Are you sure you want to delete this word?")) return;

    const token = localStorage.getItem("token");
    const itemToDelete = vocabulary[index];

    try {
      const response = await fetch("/api/user-info", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ word: itemToDelete.word }),
      });

      if (response.ok) {
        const newVocabulary = vocabulary.filter((_, i) => i !== index);
        setVocabulary(newVocabulary);
        setFilteredVocabulary(newVocabulary);
      } else {
        setError({ message: "Failed to delete word.", field: null });
      }
    } catch (error) {
      console.error("Error deleting word:", error);
      setError({ message: "Error deleting word.", field: null });
    }
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/login.css" />
        <link rel="stylesheet" href="/css/vocabulary.css" />
      </Head>
      <div className="login-container">
        <div className="login-content">
          <div className="login-form-container">
            <div className="login-card">
              <div className="login-header">
                <h1 className="login-title">Your Vocabulary</h1>
                <p className="login-subtitle">All your saved words</p>
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

              {loading ? (
                <div className="loading-container">
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
                  <span>Loading vocabulary...</span>
                </div>
              ) : (
                <>
                  <div className="vocabulary-search">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search words or translations..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>

                  {filteredVocabulary.length > 0 ? (
                    <div className="vocabulary-list">
                      <ul className="vocabulary-items">
                        {filteredVocabulary.map((item, index) => (
                          <li key={index} className="vocabulary-item">
                            <div>
                              <strong>{item.word}</strong>
                              <span>: {item.translation}</span>
                            </div>
                            <div className="vocabulary-actions">
                              <button
                                className="vocabulary-action-button delete-button"
                                onClick={() => handleDelete(index)}
                                aria-label={`Delete ${item.word}`}
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="vocabulary-empty-state">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3>No words found</h3>
                      <p>
                        {searchTerm
                          ? "Try adjusting your search term"
                          : "Start adding some words to your vocabulary!"}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="divider">
                <span className="divider-text">Add more words</span>
              </div>

              <button
                onClick={() => router.push("/user-info")}
                className="secondary-button"
                aria-label="Add new words to vocabulary"
              >
                Add New Word
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vocabulary; 