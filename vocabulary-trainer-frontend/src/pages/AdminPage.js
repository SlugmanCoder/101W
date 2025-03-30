// Updated AdminPage.js with improved styling

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const AdminPage = () => {
  const [words, setWords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [formData, setFormData] = useState({ word: '', definition: '', exampleSentence: '' });
  const [csvFile, setCsvFile] = useState(null);
  const [editWord, setEditWord] = useState('');
  const [editDefinition, setEditDefinition] = useState('');
  const [editExample, setEditExample] = useState('');
  const [message, setMessage] = useState('');

  const handleAddClick = () => {
    setEditingWord(null);
    setFormData({ word: '', definition: '', exampleSentence: '' });
    setShowModal(true);
  };
  
  const handleEditClick = (word) => {
    setEditingWord(word);
    setFormData({
      word: word.word,
      definition: word.definition,
      exampleSentence: word.exampleSentence,
    });
    setShowModal(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      if (editingWord) {
        // Update existing word
        const response = await fetch(`http://localhost:5000/api/vocabulary/${editingWord._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            definition: formData.definition,
            exampleSentence: formData.exampleSentence
          }),
        });
        if (response.ok) {
          setMessage("Word updated successfully!");
          fetchWords();
        } else {
          alert("Failed to update word");
        }
      } else {
        // Add new word
        await axios.post('/api/vocabulary', formData);
      }
  
      setShowModal(false);
      fetchWords();
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  return (
    <div className="manage-container">
      <div className="admin-header">
        <h2>Manage Vocabulary</h2>
        <div className="admin-actions">
          <button className="navbar-btn" onClick={handleAddClick}>Add Word</button>
          <button className="navbar-btn">Bulk Add</button>
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

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog-centered">
            <h5>{editingWord ? 'Edit Word' : 'Add New Word'}</h5>
            <label className="form-label">Word</label>
            <input
              type="text"
              className="form-control"
              name="word"
              value={formData.word}
              onChange={handleInputChange}
            />
            <label className="form-label">Definition</label>
            <textarea
              className="form-control"
              name="definition"
              value={formData.definition}
              onChange={handleInputChange}
            />
            <label className="form-label">Example Sentence</label>
            <textarea
              className="form-control"
              name="exampleSentence"
              value={formData.exampleSentence}
              onChange={handleInputChange}
            />
            <div className="modal-buttons mt-3">
              <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;