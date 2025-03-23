import React, { useState } from "react";

const API_KEY = "fcefce15-5eb4-4b5d-90cb-4d4c0c6d6903"; // Replace with your actual API key
const API_URL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
const VOCAB_API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DictionaryPage = () => {
  const [search, setSearch] = useState("");
  const [wordData, setWordData] = useState(null);
  const [error, setError] = useState(null);
  const [addMessage, setAddMessage] = useState(null);

  const fetchWordDefinition = async () => {
    if (!search) return;
    setError(null);
    setWordData(null);
    setAddMessage(null);
  
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`);
      const data = await response.json();
      if (response.ok) {
        let cleanedWord = data[0].word.replace(/\*/g, ""); // Remove asterisks
        let cleanedDefinition = data[0].meanings[0].definitions[0].definition.replace(/\*/g, "");
        let cleanedExample = data[0].meanings[0].definitions[0].example || "No example available.";
  
        setWordData({
          word: cleanedWord,
          definition: cleanedDefinition,
          example: cleanedExample,
        });
      } else {
        setError("Word not found. Try another word.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch definition. Please try again later.");
    }
  };
  

  const addWordToVocabulary = async () => {
    if (!wordData) return;
    try {
      const response = await fetch(`${API_URL}/api/vocabulary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: wordData.word,
          definition: wordData.definition,
          exampleSentence: wordData.exampleSentence,
        }),
      });

      if (response.ok) {
        setAddMessage("Word added successfully!");
      } else {
        setAddMessage("Failed to add word. It might already exist.");
      }
    } catch (error) {
      console.error("Error adding word:", error);
      setAddMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4">Dictionary Lookup</h2>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter a word..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={fetchWordDefinition}>
            Search
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {wordData && (
          <div className="card p-3">
            <h3>{wordData.word}</h3>
            <p><strong>Definition:</strong> {wordData.definition}</p>
            <p><strong>Example Sentence:</strong> {wordData.exampleSentence}</p>
            <button className="btn btn-success" onClick={addWordToVocabulary}>
              Add to Vocabulary
            </button>
          </div>
        )}

        {addMessage && <div className="alert alert-info mt-3">{addMessage}</div>}
      </div>
    </div>
  );
};

export default DictionaryPage;
