import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSyncAlt } from "react-icons/fa";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

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
    if (!current) return;
    setSelectedOption(option);
    if (option._id === current._id) {
      setScore((prev) => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Oops! Not quite.");
    }

    setTimeout(() => {
      setSelectedOption(null);
      setFeedback("");
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const skipQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const randomizeQuestions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/vocabulary/random/25");
      const data = await response.json();
      setQuestions(data);
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowResult(false);
      setScore(0);
    } catch (error) {
      console.error("Error randomizing questions:", error);
    }
  };

  if (!questions.length) return <div className="text-center mt-5">Loading quiz...</div>;

  if (showResult) {
    return (
      <div className="container text-center mt-5">
        <h2>Your Score: {score} / {questions.length}</h2>
        <button className="btn btn-primary mt-3" onClick={randomizeQuestions}>
          <FaSyncAlt className="me-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Question {currentIndex + 1} of {questions.length}</h5>
        <button className="btn btn-outline-primary" onClick={randomizeQuestions}>
          <FaSyncAlt className="me-1" /> Randomize
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h4 className="mb-4 fw-semibold">
            What is the meaning of: <strong className="text-primary">{current.word}</strong>?
          </h4>

          <div className="row g-3">
            {options.map((opt, index) => (
              <div className="col-6" key={opt._id}>
                <button
                  className={`btn btn-lg w-100 text-start px-4 py-3 border rounded-3 ${
                    selectedOption
                      ? opt._id === current._id
                        ? "btn-outline-success border-success"
                        : selectedOption === opt
                        ? "btn-outline-danger border-danger"
                        : "btn-outline-secondary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selectedOption}
                >
                  <span className="me-2 text-muted">{index + 1}</span>
                  {opt.definition}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              className={`btn ${
                selectedOption ? "btn-secondary" : "btn-outline-secondary"
              } px-4`}
              onClick={skipQuestion}
              disabled={!!selectedOption}
            >
              Don't know?
            </button>
          </div>

          {feedback && (
            <div className="mt-4 text-center fw-bold text-info fs-5">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
