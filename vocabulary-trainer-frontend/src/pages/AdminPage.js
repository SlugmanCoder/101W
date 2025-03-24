import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const AdminPage = () => {
  const [words, setWords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [formData, setFormData] = useState({ word: '', definition: '', exampleSentence: '' });

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const res = await axios.get('/api/vocabulary');
      setWords(res.data);
    } catch (error) {
      console.error('Error fetching words:', error);
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
      const response = await fetch("http://localhost:5000/api/vocabulary/upload-csv", {
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
      await fetch(`http://localhost:5000/api/vocabulary/${id}`, {
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

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/vocabulary/${editWord._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ definition: editDefinition, exampleSentence: editExample }),
      });
      if (response.ok) {
        setMessage("Word updated successfully!");
        fetchWords();
      } else {
        await axios.post('/api/vocabulary', formData);
      }
      setShowModal(false);
      fetchWords();
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Manage Vocabulary</h2>
        <div className="admin-controls">
          <button className="btn-filled" onClick={handleAddClick}>Add Word</button>
          <button className="btn-filled" style={{ marginLeft: '1rem' }}>Bulk Add</button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Word</th>
            <th>Definition</th>
            <th>Example</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {words.map((w) => (
            <tr key={w._id}>
              <td>{w.word}</td>
              <td>{w.definition}</td>
              <td>{w.exampleSentence}</td>
              <td>
                <button className="btn-outline" onClick={() => handleEditClick(w)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ marginBottom: '1rem' }}>{editingWord ? 'Edit Word' : 'Add New Word'}</h3>
            <div className="modal-form">
              <input
                type="text"
                name="word"
                placeholder="Word"
                value={formData.word}
                onChange={handleInputChange}
              />
              <textarea
                name="definition"
                placeholder="Definition"
                value={formData.definition}
                onChange={handleInputChange}
              />
              <textarea
                name="exampleSentence"
                placeholder="Example Sentence"
                value={formData.exampleSentence}
                onChange={handleInputChange}
              />
              <div className="modal-buttons">
                <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-filled" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;