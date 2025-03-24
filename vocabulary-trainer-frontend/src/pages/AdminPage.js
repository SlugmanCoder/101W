import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminPage = () => {
  const [words, setWords] = useState([]);
  const [message, setMessage] = useState(null);
  const [editWord, setEditWord] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [editDefinition, setEditDefinition] = useState("");
  const [editExample, setEditExample] = useState("");

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/vocabulary`)

      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
  };

  const uploadCsv = async () => {
    if (!csvFile) {
      alert("Please choose a CSV file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", csvFile);
  
    try {
      const response = await fetch(`${API_URL}/api/vocabulary/upload-csv`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("CSV uploaded successfully!");
        fetchWords(); // Reloads word list
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Check console for details.");
    }
  };
  

  const deleteWord = async (id) => {
    try {
      await fetch(`${API_URL}/api/vocabulary/${id}`, {
        method: "DELETE",
      });
      setWords(words.filter((word) => word._id !== id));
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  const openEditModal = (word) => {
    setEditWord(word);
    setEditDefinition(word.definition);
    setEditExample(word.exampleSentence);
  };

  const saveEdit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vocabulary/${editWord._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ definition: editDefinition, exampleSentence: editExample }),
      });
      if (response.ok) {
        setMessage("Word updated successfully!");
        fetchWords();
      } else {
        setMessage("Error updating word.");
      }
    } catch (error) {
      console.error("Error updating word:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <div className="card p-4 shadow-lg border-0">
        <h2 className="text-center mb-4 fw-bold text-primary">Manage Vocabulary</h2>
        {message && <div className="alert alert-info animate__animated animate__bounceIn">{message}</div>}

        {/* Bulk Import Modal */}
<div className="modal fade" id="csvImportModal" tabIndex="-1" aria-labelledby="csvImportModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="csvImportModalLabel">Bulk Import Words</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <input type="file" className="form-control my-3" accept=".csv" onChange={handleCsvUpload} />
        <button className="btn btn-success w-100" onClick={uploadCsv}>
          Upload CSV
        </button>
      </div>
    </div>
  </div>
</div>
        
        {/* Bulk Import Button */}
        <button
          className="btn btn-success position-fixed bottom-3 end-3 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: "50px", height: "50px" }}
          data-bs-toggle="modal"
          data-bs-target="#csvImportModal"
        >
          <FaPlus size={20} />
        </button>

        {/* Word Table */}
        <div className="table-responsive">
          <table className="table table-hover table-striped shadow-sm rounded overflow-hidden">
            <thead className="table-dark">
              <tr>
                <th>Word</th>
                <th>Definition</th>
                <th>Example Sentence</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word) => (
                <tr key={word._id} className="animate__animated animate__fadeInUp align-middle">
                  <td className="fw-bold text-uppercase text-primary">{word.word}</td>
                  <td className="text-wrap">{word.definition}</td>
                  <td className="text-wrap">{word.exampleSentence || "N/A"}</td>
                  <td className="d-flex justify-content-between">
                    <button
                      className="btn btn-warning btn-sm shadow-sm d-flex align-items-center me-3"
                      data-bs-toggle="modal"
                      data-bs-target="#editWordModal"
                      onClick={() => openEditModal(word)}
                    >
                      <FaEdit className="me-1" /> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm shadow-sm d-flex align-items-center"
                      onClick={() => deleteWord(word._id)}
                    >
                      <FaTrash className="me-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Word Modal */}
      <div className="modal fade" id="editWordModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Edit Word</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <label className="fw-bold">Definition</label>
              <input type="text" className="form-control my-2" value={editDefinition} onChange={(e) => setEditDefinition(e.target.value)} />
              <label className="fw-bold">Example Sentence</label>
              <textarea className="form-control my-2" value={editExample} onChange={(e) => setEditExample(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary w-100" onClick={saveEdit} data-bs-dismiss="modal">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
