import { useState, useEffect } from "react";

const UserInfo = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [newTranslation, setNewTranslation] = useState("");

  // Fetch vocabulary on page load
  useEffect(() => {
    const fetchVocabulary = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        alert("You must be logged in to view vocabulary.");
        return;
      }

      try {
        const response = await fetch("/api/user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        debugger;
        if (response.ok) {
          const data = await response.json();
          setVocabulary(data.vocabulary); // Set vocabulary state
        } else {
          alert("Failed to fetch vocabulary.");
        }
      } catch (error) {
        console.error("Error fetching vocabulary:", error);
      }
    };

    fetchVocabulary();
  }, []);

  // Handle word input change
  const handleWordChange = (e) => {
    setNewWord(e.target.value);
  };

  // Handle translation input change
  const handleTranslationChange = (e) => {
    setNewTranslation(e.target.value);
  };

  // Handle form submission (adding new vocabulary)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newWord || !newTranslation) {
      alert("Please enter both a word and its translation.");
      return;
    }

    const token = localStorage.getItem("token"); // Get token from localStorage

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
        setVocabulary(data.vocabulary); // Update the vocabulary list
        setNewWord(""); // Clear word input
        setNewTranslation(""); // Clear translation input
        alert("Vocabulary added successfully!");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error adding vocabulary:", error);
      alert("Error adding vocabulary.");
    }
  };

  return (
    <div>
      <h1>Your Vocabulary</h1>

      {/* Display the list of vocabulary */}
      <ul>
        {vocabulary.map((item, index) => (
          <li key={index}>
            <strong>{item.word}</strong>: {item.translation}
          </li>
        ))}
      </ul>

      <h2>Add a New Word</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Word"
          value={newWord}
          onChange={handleWordChange}
          required
        />
        <input
          type="text"
          placeholder="Translation"
          value={newTranslation}
          onChange={handleTranslationChange}
          required
        />
        <button type="submit">Add Vocabulary</button>
      </form>
    </div>
  );
};

export default UserInfo;
