import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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
      setFeedback("Correct!");
    } else {
      setFeedback("Oops! Try again next time.");
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
        <button className="btn btn-primary mt-3" onClick={randomizeQuestions}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Question {currentIndex + 1} of {questions.length}</h4>
        <button className="btn btn-outline-secondary btn-sm" onClick={randomizeQuestions}>🔄 Randomize</button>
      </div>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">What is the meaning of: <strong>{current.word}</strong>?</h5>
          <div className="row mt-3">
            {options.map((opt) => (
              <div className="col-md-6 mb-2" key={opt._id}>
                <button
                  className={`btn w-100 ${selectedOption === opt ? (opt._id === current._id ? 'btn-success' : 'btn-danger') : 'btn-outline-primary'}`}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selectedOption}
                >
                  {opt.definition}
                </button>
              </div>
            ))}
          </div>
          {feedback && <div className="mt-3 alert alert-info text-center">{feedback}</div>}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
