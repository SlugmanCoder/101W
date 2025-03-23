import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const FlashcardPage = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchRandomFlashcards();
  }, []);

  const fetchRandomFlashcards = async () => {
    try {
      setFlashcards([]);
      const response = await fetch("http://localhost:5000/api/vocabulary/random/25");
      const data = await response.json();
      setFlashcards(data);
      setCurrent(0);
      setShowAnswer(false);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  if (!flashcards.length) return <div className="text-center">Loading flashcards...</div>;

  const currentCard = flashcards[current];

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-lg text-center">
        <h2 className="text-primary fw-bold">
          <i className="bi bi-card-text"></i> Flashcards
        </h2>

        {/* Randomize Flashcards Button */}
        <button className="btn btn-warning mb-3" onClick={fetchRandomFlashcards}>
          <i className="bi bi-shuffle"></i> Randomize Flashcards
        </button>

        <div className="border p-4 rounded">
          <h4 className="mb-3 text-uppercase fw-bold text-primary">{currentCard.word}</h4>

          {!showAnswer ? (
            <button className="btn btn-info" onClick={() => setShowAnswer(true)}>
              <i className="bi bi-eye"></i> Show Answer
            </button>
          ) : (
            <div>
              <p><strong>Definition:</strong> {currentCard.definition}</p>
              <p><strong>Example:</strong> {currentCard.exampleSentence || "No example available"}</p>
            </div>
          )}
        </div>

        <button className="btn btn-primary mt-3" onClick={() => {
          if (current + 1 < flashcards.length) {
            setCurrent(current + 1);
            setShowAnswer(false);
          } else {
            fetchRandomFlashcards();
          }
        }}>
          <i className="bi bi-arrow-right-circle"></i> Next Card
        </button>
      </div>
    </div>
  );
};

export default FlashcardPage;
