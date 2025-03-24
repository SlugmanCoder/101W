import React, { useState, useEffect } from 'react';
import './Flashcard.css'; // <-- Add this clearly at the top

const Flashcard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/vocabulary/random/10`)
      .then(res => res.json())
      .then(data => setFlashcards(data))
      .catch(err => console.error(err));
  }, []);

  if (flashcards.length === 0) return <div>Loading flashcards...</div>;

  const currentCard = flashcards[current];

  return (
    <div className="flashcard-container">
      <div className="flashcard" onClick={() => setShowAnswer(!showAnswer)}>
        <h3>{currentCard.word}</h3>
        {showAnswer ? (
          <>
            <p><strong>Definition:</strong> {currentCard.definition}</p>
            <p><em>{currentCard.exampleSentence}</em></p>
          </>
        ) : (
          <p>(Click to reveal definition)</p>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((current + 1) % flashcards.length);
            setShowAnswer(false);
          }}
        >
          Next Word
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
