import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import "@fontsource/poppins";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showContinue, setShowContinue] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/vocabulary/random/25")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  const current = questions[currentIndex];
  const options = questions.length
    ? [...questions].sort(() => 0.5 - Math.random()).slice(0, 4)
    : [];

  const handleAnswer = (option) => {
    if (!current || selectedOption) return;
    setSelectedOption(option);
    const isCorrect = option._id === current._id;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback("Well done!");
      setTimeout(() => nextQuestion(), 1500);
    } else {
      setFeedback("Not quite, almost there!");
      setShowContinue(true);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setFeedback("");
    setShowContinue(false);
    setSkipped(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleSkip = () => {
    if (!selectedOption) {
      setFeedback("Try to remember it next time!");
      setSkipped(true);
      setTimeout(() => nextQuestion(), 1500);
    }
  };

  if (!questions.length) return <div className="text-center mt-5">Loading quiz...</div>;

  if (showResult) {
    return (
      <div className="container text-center mt-5">
        <h2>Your Score: {score} / {questions.length}</h2>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <div className="mb-3">
        <h4 className="mb-1">Question {currentIndex + 1} of {questions.length}</h4>
        <small className="text-muted">Choose matching definition</small>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">What is the meaning of: <strong>{current.word}</strong>?</h5>
          <div className="row mt-3">
            {options.map((opt, index) => {
              const isCorrect = opt._id === current._id;
              const isSelected = selectedOption && selectedOption._id === opt._id;
              let btnClass = "quiz-option";

              if (selectedOption) {
                if (isCorrect) btnClass += " correct";
                else if (isSelected) btnClass += " incorrect";
                else btnClass += " disabled";
              }

              return (
                <div className="col-md-6 mb-3" key={opt._id}>
                  <div
                    className={btnClass}
                    onClick={() => handleAnswer(opt)}
                  >
                    <span className="me-2">{index + 1}</span> {opt.definition}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-3">
            {!selectedOption && (
              <button
                className="dont-know-btn"
                onClick={handleSkip}
              >
                Don't know?
              </button>
            )}
            {(feedback && (selectedOption || skipped)) && (
              <div className={`quiz-feedback ${selectedOption && selectedOption._id === current._id ? 'success' : 'error'}`}>{feedback}</div>
            )}
            {showContinue && (
              <button className="btn btn-primary mt-3" onClick={nextQuestion}>Continue</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;