import React, { useState, useEffect } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5001/api/vocabulary/random/10')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error(err));
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (questions.length === 0) return <div>Loading quiz...</div>;

  if (finished)
    return (
      <div className="quiz-container">
        <h3>Your final score: {score}/{questions.length}</h3>
        <button onClick={() => window.location.reload()}>Retry Quiz</button>
      </div>
    );

  const currentWord = questions[current];
  const options = [...questions]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  if (!options.some(opt => opt._id === currentWord._id)) {
    options[0] = currentWord;
    options.sort(() => 0.5 - Math.random());
  }

  return (
    <div className="quiz-container">
      <h2>Quiz: What is the meaning of "{currentWord.word}"?</h2>
      <div className="quiz-options">
        {options.map((option) => (
          <button
            key={option._id}
            onClick={() => handleAnswer(option._id === currentWord._id)}
          >
            {option.definition}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;