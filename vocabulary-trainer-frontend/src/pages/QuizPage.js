import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchRandomWords();
  }, []);

  const fetchRandomWords = async () => {
    try {
      setQuestions([]); // Clear old questions first
      const response = await fetch("http://localhost:5000/api/vocabulary/random/25");
      const data = await response.json();
      setQuestions(data);
      setCurrent(0);
      setScore(0);
      setFinished(false);
      setSelectedAnswer(null);
      setFeedback(null);
    } catch (error) {
      console.error("Error fetching random words:", error);
    }
  };

  if (!questions.length) return <div className="text-center">Loading quiz...</div>;

  const currentWord = questions[current];
  const options = [...questions]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  if (!options.includes(currentWord)) {
    options[0] = currentWord;
    options.sort(() => 0.5 - Math.random());
  }

  const handleAnswer = (selected) => {
    setSelectedAnswer(selected);
    if (selected === currentWord.definition) {
      setScore(score + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Incorrect! Try again.");
    }
  };

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="text-center">
        <h3>Quiz Complete! 🎉</h3>
        <p>Your final score: <strong>{score}/{questions.length}</strong></p>
        <button className="btn btn-primary" onClick={fetchRandomWords}>
          <i className="bi bi-arrow-clockwise"></i> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4 text-primary fw-bold">
          <i className="bi bi-pencil-square"></i> Vocabulary Quiz
        </h2>

        {/* Randomize Words Button */}
        <button className="btn btn-warning mb-3" onClick={fetchRandomWords}>
          <i className="bi bi-shuffle"></i> Randomize Words
        </button>

        <h4 className="mb-3">What is the meaning of <strong className="text-primary">"{currentWord.word}"</strong>?</h4>

        <div className="list-group">
          {options.map((option, index) => (
            <button
              key={index}
              className={`list-group-item list-group-item-action ${selectedAnswer === option.definition ? (option.definition === currentWord.definition ? "list-group-item-success" : "list-group-item-danger") : ""}`}
              onClick={() => handleAnswer(option.definition)}
              disabled={selectedAnswer !== null}
            >
              {option.definition}
            </button>
          ))}
        </div>

        {feedback && <p className="mt-3 text-center">{feedback}</p>}

        <button className="btn btn-primary w-100 mt-3" onClick={nextQuestion} disabled={selectedAnswer === null}>
          <i className="bi bi-arrow-right-circle"></i> Next Question
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
