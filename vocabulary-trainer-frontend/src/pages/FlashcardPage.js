import React, { useEffect, useState } from "react";

const FlashcardPage = () => {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/vocabulary/random/25`)
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
        setIndex(0);
        setShowAnswer(false);
      });
  }, []);

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % cards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setShowAnswer(false);
  };

  const current = cards[index];

  return (
    <div className="flashcard-wrapper">
      <div className="flashcard-panel">
        <h5 className="flashcard-progress">
          Card {index + 1} of {cards.length}
        </h5>

        {current && (
          <div className="flashcard-box" onClick={() => setShowAnswer(!showAnswer)}>
            <p className="flashcard-word">{current.word}</p>
            {showAnswer && (
              <div className="flashcard-back mt-3">
                <p className="flashcard-definition"><strong>Definition:</strong> {current.definition}</p>
                <p className="flashcard-example"><strong>Example:</strong> {current.exampleSentence}</p>
              </div>
            )}
          </div>
        )}

        <div className="flashcard-nav mt-4">
          <button className="btn btn-outline-custom" onClick={prevCard}>
            Previous Flashcard
          </button>
          <button className="btn btn-outline-custom" onClick={nextCard}>
            Next Flashcard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;
