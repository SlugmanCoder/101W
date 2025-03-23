import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import FlashcardPage from "./pages/FlashcardPage";
import DictionaryPage from "./pages/DictionaryPage";
import AdminPage from "./pages/AdminPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg py-3">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-4" to="/">Vocabulary Trainer</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link btn btn-primary text-white px-4 ms-3 shadow-sm" to="/quiz">Quiz</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-primary text-white px-4 ms-3 shadow-sm" to="/flashcards">Flashcards</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-primary text-white px-4 ms-3 shadow-sm" to="/dictionary">Dictionary</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-primary text-white px-4 ms-3 shadow-sm" to="/admin">
                  Manage
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Routing */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/flashcards" element={<FlashcardPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
