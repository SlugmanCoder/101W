import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  return (
    <div>
      {/* Home Page Content */}
      <div className="container mt-5 text-center">
        <h1 className="mb-4">Welcome to the Vocabulary Trainer</h1>
        <p className="lead">
          This site helps you learn new words through flashcards and quizzes. You can also look up words in our dictionary!
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <a href="/quiz" className="btn btn-primary btn-lg">Take a Quiz</a>
          <a href="/flashcards" className="btn btn-secondary btn-lg">View Flashcards</a>
          <a href="/dictionary" className="btn btn-info btn-lg">Use Dictionary</a>
          <a href="/admin" className="btn btn-danger btn-lg">Manage Words</a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;